-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own credits" ON user_credits;
DROP POLICY IF EXISTS "Only functions can modify credits" ON user_credits;

-- Create the user_credits table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_credits (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  credits INTEGER DEFAULT 0,
  has_unlimited BOOLEAN DEFAULT false,
  unlimited_until TIMESTAMP WITH TIME ZONE,
  subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a function to add credits to a user
CREATE OR REPLACE FUNCTION add_credits(p_user_id UUID, p_credits INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_credits (user_id, credits)
  VALUES (p_user_id, p_credits)
  ON CONFLICT (user_id)
  DO UPDATE SET
    credits = user_credits.credits + p_credits,
    updated_at = CURRENT_TIMESTAMP;
END;
$$;

-- Create a function to update subscription status
CREATE OR REPLACE FUNCTION update_subscription(
  p_user_id UUID,
  p_subscription_id TEXT,
  p_current_period_end TIMESTAMP WITH TIME ZONE
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_credits (
    user_id,
    has_unlimited,
    unlimited_until,
    subscription_id,
    credits
  )
  VALUES (
    p_user_id,
    true,
    p_current_period_end,
    p_subscription_id,
    0
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    has_unlimited = true,
    unlimited_until = p_current_period_end,
    subscription_id = p_subscription_id,
    updated_at = CURRENT_TIMESTAMP;
END;
$$;

-- Create a function to remove unlimited access
CREATE OR REPLACE FUNCTION remove_unlimited_access(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE user_credits
  SET
    has_unlimited = false,
    unlimited_until = NULL,
    subscription_id = NULL,
    updated_at = CURRENT_TIMESTAMP
  WHERE user_id = p_user_id;
END;
$$;

-- Create RLS policies
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

-- Recreate the policies
CREATE POLICY "Users can view their own credits"
  ON user_credits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Only functions can modify credits"
  ON user_credits
  FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_user_credits_updated_at ON user_credits;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_credits_updated_at
    BEFORE UPDATE ON user_credits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON user_credits TO authenticated; 