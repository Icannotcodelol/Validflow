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

-- Recreate the function to use credits_balance
CREATE OR REPLACE FUNCTION public.deduct_analysis_credit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER -- Run with the permissions of the user who defined the function
AS $$
DECLARE
    v_has_unlimited boolean;
    v_unlimited_until timestamptz;
BEGIN
    -- Get the user's subscription status
    SELECT has_unlimited, unlimited_until
    INTO v_has_unlimited, v_unlimited_until
    FROM public.user_credits
    WHERE user_id = NEW.user_id;

    -- Only deduct if user doesn't have an active unlimited subscription
    IF NOT (v_has_unlimited = true AND v_unlimited_until IS NOT NULL AND v_unlimited_until > now()) THEN
        UPDATE public.user_credits
        SET credits_balance = credits_balance - 1 -- Use credits_balance here
        WHERE user_id = NEW.user_id
        AND credits_balance > 0; -- Use credits_balance here
    END IF;

    RETURN NEW;
END;
$$; 