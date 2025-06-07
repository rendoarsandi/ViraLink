CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  objective TEXT,
  budget BIGINT,
  reward_model TEXT,
  reward_rate BIGINT,
  content_link TEXT,
  instructions TEXT,
  status TEXT DEFAULT 'active',
  promoters_count INT DEFAULT 0,
  clicks_count BIGINT DEFAULT 0,
  spent_budget BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Policies for RLS
-- Creators can see and update their own campaigns
CREATE POLICY "Creators can view their own campaigns." ON campaigns
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Creators can update their own campaigns." ON campaigns
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Creators can insert their own campaigns." ON campaigns
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Promoters can view active campaigns
CREATE POLICY "Promoters can view active campaigns." ON campaigns
  FOR SELECT USING (status = 'active');

-- Optional: Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_campaigns_updated_at
BEFORE UPDATE ON campaigns
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
