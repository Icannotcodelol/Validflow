-- Update default credits balance to 3 for new users
ALTER TABLE user_credits 
ALTER COLUMN credits_balance SET DEFAULT 3;

-- Update RLS policies
DROP POLICY IF EXISTS "Users can view their own credits" ON user_credits;
CREATE POLICY "Users can view their own credits"
ON user_credits FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Only functions can modify credits" ON user_credits;
CREATE POLICY "Only functions can modify credits"
ON user_credits FOR ALL
TO service_role
USING (true)
WITH CHECK (true); 