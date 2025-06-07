CREATE TABLE IF NOT EXISTS promoter_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  promoter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  tracking_link TEXT UNIQUE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'joined', -- e.g., 'joined', 'active', 'paused', 'completed'
  clicks BIGINT DEFAULT 0,
  earnings BIGINT DEFAULT 0,
  CONSTRAINT unique_promoter_campaign UNIQUE (promoter_id, campaign_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE promoter_campaigns ENABLE ROW LEVEL SECURITY;

-- Policies for RLS
-- Promoters can view their own joined campaigns
CREATE POLICY "Promoters can view their own joined campaigns." ON promoter_campaigns
  FOR SELECT USING (auth.uid() = promoter_id);

-- Promoters can insert new joined campaigns (only if they are the promoter_id)
CREATE POLICY "Promoters can insert their own joined campaigns." ON promoter_campaigns
  FOR INSERT WITH CHECK (auth.uid() = promoter_id);

-- Promoters can update their own joined campaigns (e.g., clicks, earnings)
CREATE POLICY "Promoters can update their own joined campaigns." ON promoter_campaigns
  FOR UPDATE USING (auth.uid() = promoter_id);

-- Creators can view promoter_campaigns associated with their campaigns
CREATE POLICY "Creators can view promoter_campaigns for their campaigns." ON promoter_campaigns
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM campaigns WHERE campaigns.id = promoter_campaigns.campaign_id AND campaigns.creator_id = auth.uid())
  );

-- Function to update campaign's promoters_count when a promoter joins/leaves
CREATE OR REPLACE FUNCTION update_campaign_promoters_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE campaigns
        SET promoters_count = promoters_count + 1
        WHERE id = NEW.campaign_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE campaigns
        SET promoters_count = promoters_count - 1
        WHERE id = OLD.campaign_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_promoters_count_on_join
AFTER INSERT ON promoter_campaigns
FOR EACH ROW EXECUTE FUNCTION update_campaign_promoters_count();

CREATE TRIGGER update_promoters_count_on_leave
AFTER DELETE ON promoter_campaigns
FOR EACH ROW EXECUTE FUNCTION update_campaign_promoters_count();
