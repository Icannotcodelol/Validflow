import { UserInput } from "../types";
import { queryPerplexity } from "@/utils/ai-clients";
import { MarketSizeGrowthSchema } from "../models";
import { MarketSizeGrowthData } from "@/types/sections";

interface MarketSizeGrowthResponse {
  totalAddressableMarket: {
    size: string;
    description: string;
    methodology: string;
  };
  serviceableAddressableMarket: {
    size: string;
    description: string;
    limitations: string[];
  };
  serviceableObtainableMarket: {
    size: string;
    description: string;
    timeframe: string;
    assumptions: string[];
  };
  growthRate: {
    current: string;
    projected: string;
    factors: string[];
  };
  marketTrends: Array<{
    trend: string;
    description: string;
    impact: string;
    timeframe: string;
  }>;
  marketDrivers: Array<{
    driver: string;
    description: string;
    impact: string;
  }>;
  marketChallenges: Array<{
    challenge: string;
    description: string;
    impact: string;
    mitigation: string;
  }>;
}

function validateMarketSizeGrowthResponse(data: any): data is MarketSizeGrowthResponse {
  if (!data || typeof data !== 'object') return false;

  // Validate required objects and their properties
  const requiredObjects = [
    'totalAddressableMarket',
    'serviceableAddressableMarket',
    'serviceableObtainableMarket',
    'growthRate'
  ];

  for (const obj of requiredObjects) {
    if (!data[obj] || typeof data[obj] !== 'object') return false;
    
    // Validate required string properties
    const requiredStrings = obj === 'growthRate' 
      ? ['current', 'projected']
      : ['size', 'description'];
    
    for (const prop of requiredStrings) {
      if (typeof data[obj][prop] !== 'string' || !data[obj][prop].trim()) return false;
    }

    // Validate required arrays
    if (obj === 'growthRate' && (!Array.isArray(data[obj].factors) || data[obj].factors.length === 0)) return false;
    if (obj === 'serviceableAddressableMarket' && (!Array.isArray(data[obj].limitations) || data[obj].limitations.length === 0)) return false;
    if (obj === 'serviceableObtainableMarket' && (!Array.isArray(data[obj].assumptions) || data[obj].assumptions.length === 0)) return false;
  }

  // Validate arrays of objects
  const requiredArrays = ['marketTrends', 'marketDrivers', 'marketChallenges'];
  for (const array of requiredArrays) {
    if (!Array.isArray(data[array]) || data[array].length === 0) return false;
    
    // Validate each object in the array
    for (const item of data[array]) {
      if (!item || typeof item !== 'object') return false;
      
      // Validate required properties based on array type
      const requiredProps = array === 'marketTrends' 
        ? ['trend', 'description', 'impact', 'timeframe']
        : array === 'marketDrivers'
        ? ['driver', 'description', 'impact']
        : ['challenge', 'description', 'impact', 'mitigation'];
      
      for (const prop of requiredProps) {
        if (typeof item[prop] !== 'string' || !item[prop].trim()) return false;
      }
    }
  }

  return true;
}

function generateMarketSizeGrowthPrompt(input: UserInput): string {
  return `You are a market research expert specializing in startup market analysis. Your task is to analyze the following business idea and provide a detailed market size and growth analysis.

IMPORTANT: You MUST return ONLY a valid JSON object. Do not include any explanations, markdown, or additional text.

Business Details:
Industry: ${input.industry}
Sub-industry: ${input.subIndustry}
Target Customers: ${input.targetCustomers}
Description: ${input.description}
${input.additionalInfo ? `Additional Info: ${input.additionalInfo}` : ''}

Return a JSON object with this exact structure:
{
  "totalAddressableMarket": {
    "size": "Total market size in dollars (e.g., '$500B')",
    "description": "Detailed analysis of total market size",
    "methodology": "How the size was calculated"
  },
  "serviceableAddressableMarket": {
    "size": "SAM size in dollars (e.g., '$100B')",
    "description": "Detailed analysis of serviceable market",
    "limitations": ["Key limitations 1", "Key limitations 2"]
  },
  "serviceableObtainableMarket": {
    "size": "SOM size in dollars (e.g., '$10B')",
    "description": "Detailed analysis of obtainable market",
    "timeframe": "Expected timeframe to achieve (e.g., '3-5 years')",
    "assumptions": ["Key assumption 1", "Key assumption 2"]
  },
  "growthRate": {
    "current": "Current annual growth rate (e.g., '15%')",
    "projected": "Projected growth rate (e.g., '20%')",
    "factors": ["Growth factor 1", "Growth factor 2"]
  },
  "marketTrends": [
    {
      "trend": "Trend name",
      "description": "Trend description",
      "impact": "Impact on market",
      "timeframe": "Expected duration"
    }
  ],
  "marketDrivers": [
    {
      "driver": "Driver name",
      "description": "Driver description",
      "impact": "Impact on market"
    }
  ],
  "marketChallenges": [
    {
      "challenge": "Challenge name",
      "description": "Challenge description",
      "impact": "Impact on market",
      "mitigation": "Potential mitigation strategies"
    }
  ]
}

Requirements:
1. All values must be realistic and based on current market data
2. Include specific numbers and percentages where applicable
3. Provide detailed descriptions and explanations
4. Consider industry-specific factors and trends
5. Account for market maturity and competition
6. Include both short-term and long-term projections
7. Consider regulatory and economic factors

Remember: Return ONLY the JSON object, no additional text.`;
}

function transformMarketSizeGrowthData(data: any): MarketSizeGrowthData {
  return {
    status: 'completed',
    error: undefined,
    sectionId: 'market-size-growth',
    createdAt: new Date(),
    updatedAt: new Date(),
    marketSize: {
      total: data.totalAddressableMarket.size,
      addressable: data.serviceableAddressableMarket.size,
      obtainable: data.serviceableObtainableMarket.size,
      growth: data.growthRate.current,
      analysis: data.totalAddressableMarket.description,
      projections: data.marketTrends.map((trend: any) => ({
        year: trend.timeframe,
        value: trend.impact
      }))
    }
  };
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

export async function generateMarketSizeGrowth(input: UserInput): Promise<MarketSizeGrowthData> {
  const prompt = generateMarketSizeGrowthPrompt(input);
  
  try {
    console.log('Generating market size growth analysis with Perplexity...');
    
    const response = await retryWithBackoff(async () => {
      try {
        const data = await queryPerplexity(prompt);
        
        if (!data.choices?.[0]?.message?.content) {
          console.error('Invalid Perplexity response structure:', data);
          throw new Error('Invalid response from Perplexity API');
        }
        
        return data;
      } catch (error) {
        console.error('Error in market size growth API call:', error);
        throw error;
      }
    });
    
    // Try to parse the JSON response
    try {
      const content = response.choices[0].message.content;
      // Extract JSON from the response if it's wrapped in text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      const parsedData = JSON.parse(jsonMatch[0]);

      // Validate the parsed data
      if (!validateMarketSizeGrowthResponse(parsedData)) {
        console.error('Invalid market size growth data structure:', parsedData);
        return {
          status: 'failed',
          error: 'Invalid response structure',
          sectionId: 'market-size-growth',
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }

      // Transform the data to the expected format
      return transformMarketSizeGrowthData(parsedData);

    } catch (parseError) {
      console.error('Failed to parse market size growth JSON:', parseError);
      return {
        status: 'failed',
        error: 'Failed to parse response data',
        sectionId: 'market-size-growth',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

  } catch (error) {
    console.error('Error generating market size growth analysis:', error);
    return {
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      sectionId: 'market-size-growth',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
} 