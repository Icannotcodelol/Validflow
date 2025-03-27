import { DetailedAnalysis, AnalysisInput } from '../../../lib/models/analysis';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const FINANCIAL_PROJECTIONS_PROMPT = `You are a startup financial advisor specializing in realistic financial projections. Analyze the following startup idea and generate detailed financial projections across three scenarios.

Startup Details:
Industry: {industry}
Stage: {currentStage}
Pricing Model: {pricingModel}
Team: {teamComposition}
Description: {description}

Please provide detailed financial projections in the following JSON format:
{
  "financialAnalysis": {
    "revenueStreams": ["List of revenue streams"],
    "costStructure": {
      "fixed": ["List of fixed costs"],
      "variable": ["List of variable costs"],
      "unitEconomics": {
        "cac": "Customer Acquisition Cost (e.g., '$50')",
        "ltv": "Lifetime Value (e.g., '$500')",
        "margin": "Profit Margin (e.g., '60%')",
        "paybackPeriod": "CAC Payback Period (e.g., '6 months')",
        "breakEvenPoint": "Break-even Analysis (e.g., '1,000 customers')"
      }
    },
    "projections": {
      "year1": "Projected revenue for year 1",
      "year3": "Projected revenue for year 3",
      "breakeven": "Expected breakeven point"
    },
    "score": 0
  }
}

Guidelines for projections:
1. Be realistic and conservative in assumptions
2. Consider industry-specific metrics and benchmarks
3. Account for typical startup costs and overhead
4. Include reasonable growth rates based on stage
5. Factor in market conditions and competition
6. Consider team size and operational costs
7. Account for marketing and customer acquisition costs
8. Include typical SaaS/startup metrics (CAC, LTV, etc.)

The score should be between 0 and 100, where 0 is extremely poor and 100 is excellent.
Ensure all projections are realistic and based on industry data.`;

function generateFinancialProjectionsPrompt(input: AnalysisInput): string {
  return FINANCIAL_PROJECTIONS_PROMPT
    .replace('{industry}', input.industry)
    .replace('{currentStage}', input.currentStage)
    .replace('{pricingModel}', input.pricingModel)
    .replace('{teamComposition}', input.teamComposition)
    .replace('{description}', input.description);
}

export async function generateFinancialProjections(input: AnalysisInput): Promise<DetailedAnalysis['financialAnalysis']> {
  try {
    const prompt = generateFinancialProjectionsPrompt(input);
    
    console.log('Generating financial projections with OpenAI...', {
      hasApiKey: !!process.env.OPENAI_API_KEY,
      apiKeyPrefix: process.env.OPENAI_API_KEY?.substring(0, 8),
      promptLength: prompt.length
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a startup financial advisor providing structured analysis in JSON format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    console.log('OpenAI API Response:', {
      hasChoices: !!completion.choices,
      choicesLength: completion.choices?.length,
      hasContent: !!completion.choices?.[0]?.message?.content,
      usage: completion.usage
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    const parsedContent = JSON.parse(content);
    return parsedContent.financialAnalysis;

  } catch (error) {
    console.error('Error generating financial projections:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    throw error;
  }
} 