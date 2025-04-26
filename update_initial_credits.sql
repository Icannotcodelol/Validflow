-- Update the create_user_credits function to set initial credits to 3
CREATE OR REPLACE FUNCTION create_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, credits_balance, has_unlimited)
  VALUES (NEW.id, 3, false);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 