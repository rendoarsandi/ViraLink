-- Allow creators to view profiles of promoters associated with their campaigns
CREATE POLICY "Creators can view promoter profiles for their campaigns." ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM promoter_campaigns pc
      JOIN campaigns c ON pc.campaign_id = c.id
      WHERE pc.promoter_id = profiles.id AND c.creator_id = auth.uid()
    )
  );
