import { UserInput } from "../types";
import { queryPerplexity } from "@/utils/ai-clients";
import { MarketingChannelsSchema } from "../models";
import { MarketingChannelsData } from "@/types/sections";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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

function normalizePercentage(value: string): string {
  // Remove any spaces and ensure it ends with %
  const cleaned = value.replace(/\s+/g, '');
  if (cleaned.endsWith('%')) return cleaned;
  // If it's a decimal (e.g., 0.5), convert to percentage
  if (cleaned.match(/^0\.\d+$/)) {
    return `${Math.round(parseFloat(cleaned) * 100)}%`;
  }
  // If it's just a number, add %
  if (cleaned.match(/^\d+$/)) {
    return `${cleaned}%`;
  }
  return '0%';
}

function normalizeCurrency(value: string | number): string {
  if (typeof value === 'number') {
    return `$${value.toLocaleString()}`;
  }
  // If it's already a currency string, ensure proper format
  const cleaned = value.replace(/[^0-9.]/g, '');
  if (cleaned) {
    return `$${parseFloat(cleaned).toLocaleString()}`;
  }
  return '$0';
}

function transformMarketingChannelsData(data: any): MarketingChannelsData {
  try {
    // If data is a string, try to parse it
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (parseError) {
        console.error('Failed to parse marketing channels data:', parseError);
        throw new Error('Invalid JSON format in marketing channels data');
      }
    }

    // If data is not an object, throw error
    if (typeof data !== 'object' || data === null) {
      throw new Error('Marketing channels data must be an object');
    }

    // Normalize channels data
    const channels = Array.isArray(data.channels) ? data.channels.map((channel: any) => ({
      name: String(channel?.name || 'Unnamed Channel').trim(),
      description: String(channel?.description || 'No description provided').trim(),
      type: ['primary', 'secondary', 'experimental'].includes(channel?.type) ? channel.type : 'experimental',
      metrics: {
        reach: String(channel?.metrics?.reach || '0').trim(),
        cost: normalizeCurrency(channel?.metrics?.cost || 0),
        roi: normalizePercentage(channel?.metrics?.roi || '0'),
        conversionRate: normalizePercentage(channel?.metrics?.conversionRate || '0')
      },
      strategy: String(channel?.strategy || 'Strategy to be defined').trim(),
      timeline: String(channel?.timeline || 'Timeline to be determined').trim(),
      budget: normalizeCurrency(channel?.budget || 0),
      kpis: Array.isArray(channel?.kpis) 
        ? channel.kpis.map((kpi: any) => String(kpi).trim()).filter(Boolean)
        : []
    })) : [];

    // Normalize budget data
    const budget = data.budget ? {
      total: normalizeCurrency(data.budget.total || 0),
      breakdown: Array.isArray(data.budget.breakdown) 
        ? data.budget.breakdown.map((item: any) => ({
            category: String(item?.category || 'Uncategorized').trim(),
            amount: normalizeCurrency(item?.amount || 0),
            percentage: normalizePercentage(item?.percentage || '0')
          }))
        : [],
      timeline: String(data.budget.timeline || '12 months').trim()
    } : undefined;

    // Normalize recommendations and analysis
    const recommendations = Array.isArray(data.recommendations)
      ? data.recommendations.map((rec: any) => String(rec).trim()).filter(Boolean)
      : [];

    const analysis = String(data?.analysis || '').trim();

    // Construct the normalized response
    const normalizedData = {
      status: 'completed' as const,
      sectionId: 'marketingChannels',
      createdAt: new Date(),
      updatedAt: new Date(),
      channels,
      budget,
      recommendations,
      analysis
    };

    // Validate against schema
    MarketingChannelsSchema.parse(normalizedData);

    return normalizedData;
  } catch (error) {
    console.error('Error normalizing marketing channels data:', error);
    // Return a minimal valid structure with detailed error
    return {
      status: 'failed' as const,
      error: error instanceof Error ? error.message : 'Failed to normalize data',
      sectionId: 'marketingChannels',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}

function generateMarketingChannelsPrompt(input: UserInput): string {
  return `Based on the following business details, please provide a detailed marketing channels strategy in JSON format.

Business Details:
Description: "${input.description}"
Industry: ${input.industry}
Sub-Industry: ${input.subIndustry}
Target Customers: ${input.targetCustomers}
Current Stage: ${input.currentStage}
Team: ${input.teamComposition}
Pricing Model: ${input.pricingModel}
${input.additionalInfo ? `Additional Info: ${input.additionalInfo}` : ''}

The response should include:
1. Marketing channels with metrics and implementation details
2. Budget allocation and timeline
3. Recommendations and analysis

Format your response as a JSON object with this exact structure:
{
  "channels": [
    {
      "name": "Channel name",
      "description": "Channel description",
      "type": "primary|secondary|experimental",
      "metrics": {
        "reach": "Estimated reach",
        "cost": "Cost estimate in USD",
        "roi": "Expected ROI as percentage",
        "conversionRate": "Expected conversion rate as percentage"
      },
      "strategy": "Implementation strategy",
      "timeline": "Implementation timeline",
      "budget": "Channel budget in USD",
      "kpis": ["KPI 1", "KPI 2"]
    }
  ],
  "budget": {
    "total": "Total marketing budget in USD",
    "breakdown": [
      {
        "category": "Budget category",
        "amount": "Amount allocated in USD",
        "percentage": "Percentage of total (e.g., 25%)"
      }
    ],
    "timeline": "Budget timeline"
  },
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ],
  "analysis": "Overall marketing strategy analysis"
}

Ensure all monetary values are formatted as currency (e.g., "$1,000") and all percentages include the % symbol.`;
}

export async function generateMarketingChannels(input: UserInput): Promise<MarketingChannelsData> {
  try {
    const prompt = generateMarketingChannelsPrompt(input);

    const response = await retryWithBackoff(async () => {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4-turbo-preview",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;
        if (!content) {
          throw new Error('Empty response from OpenAI');
        }

        // Log the raw response for debugging
        console.log('Raw marketing channels response:', content);
        
        return JSON.parse(content);
      } catch (error) {
        console.error('Error in marketing channels API call:', error);
        throw error;
      }
    });

    return {
      status: 'completed',
      sectionId: 'marketingChannels',
      createdAt: new Date(),
      updatedAt: new Date(),
      channels: response.channels,
      budget: response.budget,
      recommendations: response.recommendations,
      analysis: response.analysis
    };

  } catch (error) {
    console.error('Error generating marketing channels:', error);
    return {
      status: 'failed',
      error: error instanceof Error ? error.message : 'Failed to generate marketing channels',
      sectionId: 'marketingChannels',
      createdAt: new Date(),
      updatedAt: new Date(),
      channels: [],
      budget: {
        total: '',
        breakdown: [],
        timeline: ''
      },
      recommendations: [],
      analysis: ''
    };
  }
} 