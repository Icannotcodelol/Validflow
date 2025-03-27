import { VCSentiment, UserInput } from '../models';
import { VCSentimentData } from '@/types/sections';
import Anthropic from '@anthropic-ai/sdk';
  
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
  
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
  
const VC_SENTIMENT_PROMPT = `You are a venture capital market analyst. Analyze the following business idea and provide a detailed analysis of investment landscape and market sentiment.
  
Business Details:
Industry: {industry}
Sub-Industry: {subIndustry}
Target Customers: {targetCustomers}
Current Stage: {currentStage}
Description: {description}
  
Please provide a comprehensive investment landscape analysis in JSON format with the following structure:
{
  "marketSentiment": {
    "overall": "Overall market sentiment analysis",
    "confidence": "High|Medium|Low",
    "keyFactors": ["Factor 1", "Factor 2"],
    "risks": ["Risk 1", "Risk 2"]
  },
  "recentInvestments": [
    {
      "company": "Company name",
      "amount": "Investment amount",
      "date": "Investment date",
      "investors": ["Investor 1", "Investor 2"],
      "purpose": "Investment purpose",
      "valuation": "Company valuation at investment"
    }
  ],
  "investmentTrends": [
    {
      "trend": "Trend name",
      "description": "Trend description",
      "impact": "Impact on investment landscape",
      "examples": ["Example 1", "Example 2"]
    }
  ],
  "valuationMetrics": [
    {
      "metric": "Valuation metric",
      "value": "Current value",
      "benchmark": "Industry benchmark",
      "methodology": "How the metric is calculated"
    }
  ],
  "marketOpportunities": [
    {
      "opportunity": "Opportunity name",
      "description": "Opportunity description",
      "potential": "High|Medium|Low",
      "timeline": "Expected timeline"
    }
  ]
}
  
Ensure the analysis:
1. Is based on recent market data and trends
2. Includes specific examples of relevant investments
3. Provides clear valuation benchmarks
4. Addresses both opportunities and challenges
5. Is industry-specific and relevant to the business idea
6. Includes realistic timelines and expectations`;
  
function generateVCSentimentPrompt(input: UserInput): string {
  return VC_SENTIMENT_PROMPT
    .replace('{industry}', input.industry)
    .replace('{subIndustry}', input.subIndustry)
    .replace('{targetCustomers}', input.targetCustomers)
    .replace('{currentStage}', input.currentStage)
    .replace('{description}', input.description);
}
  
function transformVCSentimentData(data: VCSentiment): VCSentimentData {
  return {
    status: data.status,
    error: data.error,
    sectionId: data.sectionId || '',
    createdAt: data.createdAt || new Date(),
    updatedAt: data.updatedAt || new Date(),
    sentiment: {
      overall: data.marketSentiment.overall.toLowerCase() as 'positive' | 'neutral' | 'negative',
      confidence: data.marketSentiment.confidence === 'High' ? 90 : 
                 data.marketSentiment.confidence === 'Medium' ? 60 : 30,
      keyFactors: [...data.marketSentiment.keyFactors, ...data.marketSentiment.risks]
    },
    marketTrends: data.investmentTrends.map(trend => ({
      trend: trend.trend,
      impact: trend.impact,
      confidence: trend.examples.length > 2 ? 90 : 70
    })),
    notableTransactions: data.recentInvestments.map(investment => ({
      company: investment.company,
      amount: investment.amount,
      date: investment.date,
      investors: investment.investors,
      purpose: investment.purpose,
      valuation: investment.valuation
    })),
    recommendations: [
      ...data.marketOpportunities.map(opp => ({
        category: opp.opportunity,
        items: [opp.description],
        priority: opp.potential.toLowerCase() as 'high' | 'medium' | 'low'
      }))
    ]
  };
}
  
export async function generateVCSentiment(input: UserInput): Promise<VCSentimentData> {
  try {
    const prompt = generateVCSentimentPrompt(input);
  
    const response = await retryWithBackoff(async () => {
      const res = await anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      });
  
      const content = res.content[0].type === 'text' 
        ? res.content[0].text 
        : JSON.stringify(res.content[0]);
  
      // Try to extract JSON if the response contains surrounding text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
  
      try {
        const parsedJson = JSON.parse(jsonMatch[0]);
        return transformVCSentimentData(parsedJson);
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        throw parseError;
      }
    });
  
    return response;
  
  } catch (error) {
    console.error('Error generating VC sentiment analysis:', error);
    return {
      status: 'failed',
      error: error instanceof Error ? error.message : 'Failed to generate VC sentiment analysis',
      sectionId: 'vcSentiment',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
} 