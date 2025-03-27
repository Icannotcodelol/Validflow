import { ReportSummary, UserInput } from '../models';
import Anthropic from '@anthropic-ai/sdk';
  
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
  
const REPORT_SUMMARY_PROMPT = `You are a startup analyst. Based on all previous sections, provide a comprehensive summary of the startup validation report.
  
Startup Details:
Industry: {industry}
Sub-Industry: {subIndustry}
Target Customers: {targetCustomers}
Current Stage: {currentStage}
Description: {description}
  
Please provide a comprehensive report summary in JSON format with the following structure:
{
  "overallAssessment": "Comprehensive assessment of the startup's potential",
  "keyRecommendations": [
    "Recommendation 1",
    "Recommendation 2",
    "Recommendation 3"
  ],
  "nextSteps": [
    "Next step 1",
    "Next step 2",
    "Next step 3"
  ],
  "riskLevel": "High|Medium|Low",
  "confidenceScore": 0
}
  
Ensure the summary:
1. Synthesizes key findings from all previous sections
2. Provides clear, actionable recommendations
3. Includes specific next steps
4. Provides a balanced assessment of risks and opportunities
5. Assigns a confidence score between 0 and 100`;
  
function generateReportSummaryPrompt(input: UserInput): string {
  return REPORT_SUMMARY_PROMPT
    .replace('{industry}', input.industry)
    .replace('{subIndustry}', input.subIndustry)
    .replace('{targetCustomers}', input.targetCustomers)
    .replace('{currentStage}', input.currentStage)
    .replace('{description}', input.description);
}
  
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryWithBackoff<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0 || !isRetryableError(error)) {
      throw error;
    }
    
    console.log(`Retrying after error: ${error}. Retries left: ${retries}`);
    await sleep(RETRY_DELAY * (MAX_RETRIES - retries + 1));
    return retryWithBackoff(fn, retries - 1);
  }
}

function isRetryableError(error: any): boolean {
  if (error?.message?.includes('fetch failed')) return true;
  if (error?.message?.includes('network error')) return true;
  if (error?.message?.includes('timeout')) return true;
  if (error?.status === 429) return true;
  if (error?.status === 529) return true;
  return false;
}

export async function generateReportSummary(input: UserInput): Promise<ReportSummary> {
  try {
    const prompt = generateReportSummaryPrompt(input);
  
    const response = await retryWithBackoff(async () => {
      try {
        const data = await anthropic.messages.create({
          model: 'claude-3-opus-20240229',
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }],
        });
        
        const content = data.content[0].type === 'text' 
          ? data.content[0].text 
          : JSON.stringify(data.content[0]);
        
        return content;
      } catch (error) {
        console.error('Error in report summary API call:', error);
        throw error;
      }
    });
  
    // Try to extract JSON if the response contains surrounding text
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsedJson = JSON.parse(jsonMatch[0]);
        return parsedJson;
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
      }
    }
  
    // Retry with a simplified prompt
    const retryResponse = await retryWithBackoff(async () => {
      try {
        const data = await anthropic.messages.create({
          model: 'claude-3-opus-20240229',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: 'Please provide a valid JSON object with the following structure:\n' +
                JSON.stringify({
                  overallAssessment: '',
                  keyRecommendations: [],
                  nextSteps: [],
                  riskLevel: 'Medium',
                  confidenceScore: 50
                }, null, 2)
            }
          ],
        });
        
        return data.content[0].type === 'text'
          ? data.content[0].text
          : JSON.stringify(data.content[0]);
      } catch (error) {
        console.error('Error in report summary retry API call:', error);
        throw error;
      }
    });
  
    return JSON.parse(retryResponse);
  
  } catch (error) {
    console.error('Error generating report summary:', error);
    throw error;
  }
} 