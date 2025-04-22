-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS deduct_credit_on_analysis ON analyses;

-- Create trigger for deducting credits when analysis is created
CREATE TRIGGER deduct_credit_on_analysis
    AFTER INSERT ON analyses
    FOR EACH ROW
    EXECUTE FUNCTION deduct_analysis_credit(); 