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

IMPORTANT INSTRUCTIONS:
1. Return ONLY a clean, parsable JSON object
2. Do NOT include any explanations, markdown, or commentary outside the JSON
3. Ensure the response exactly matches the schema below
4. Use objective, data-driven language
5. Replace all placeholder values with relevant content based on the business details
6. Maintain the exact structure while customizing the content

Business Details:
Industry: ${input.industry}
Sub-industry: ${input.subIndustry}
Target Customers: ${input.targetCustomers}
Description: ${input.description}
${input.additionalInfo ? `Additional Info: ${input.additionalInfo}` : ''}

TEMPLATE TO FOLLOW (replace placeholders with relevant content):
{
  "totalAddressableMarket": {
    "size": "[TOTAL_MARKET_SIZE_IN_DOLLARS] (e.g., '$500B for global healthcare market')",
    "description": "[MARKET_OVERVIEW] [KEY_SEGMENTS] [GROWTH_INDICATORS] [MARKET_MATURITY]",
    "methodology": "[DATA_SOURCES] [CALCULATION_METHOD] [ASSUMPTIONS]"
  },
  "serviceableAddressableMarket": {
    "size": "[SERVICEABLE_MARKET_SIZE] (e.g., '$100B for home healthcare services')",
    "description": "[TARGET_MARKET_DEFINITION] [GEOGRAPHIC_SCOPE] [MARKET_NEEDS]",
    "limitations": [
      "[GEOGRAPHIC_LIMITATION]",
      "[REGULATORY_LIMITATION]",
      "[TECHNOLOGICAL_LIMITATION]"
    ]
  },
  "serviceableObtainableMarket": {
    "size": "[OBTAINABLE_MARKET_SIZE] (e.g., '$10B initial target market')",
    "description": "[REALISTIC_MARKET_CAPTURE] [COMPETITIVE_LANDSCAPE] [ENTRY_STRATEGY]",
    "timeframe": "[YEARS_TO_ACHIEVE] (e.g., '3-5 years')",
    "assumptions": [
      "[MARKET_PENETRATION_RATE]",
      "[COMPETITIVE_RESPONSE]",
      "[GROWTH_TRAJECTORY]"
    ]
  },
  "growthRate": {
    "current": "[CURRENT_GROWTH_RATE] (e.g., '15% annually')",
    "projected": "[PROJECTED_GROWTH_RATE] (e.g., '20% annually')",
    "factors": [
      "[PRIMARY_GROWTH_DRIVER]",
      "[SECONDARY_GROWTH_DRIVER]",
      "[MARKET_CONDITION]"
    ]
  },
  "marketTrends": [
    {
      "trend": "[TREND_NAME] (e.g., 'Shift to Remote Healthcare')",
      "description": "[TREND_DETAILS] [MARKET_IMPACT] [ADOPTION_RATE]",
      "impact": "[BUSINESS_IMPACT] [OPPORTUNITY_SIZE] [RISK_FACTORS]",
      "timeframe": "[TREND_DURATION] (e.g., '2-3 years')"
    }
  ],
  "marketDrivers": [
    {
      "driver": "[DRIVER_NAME] (e.g., 'Aging Population')",
      "description": "[DRIVER_DETAILS] [SUPPORTING_DATA]",
      "impact": "[QUANTIFIED_IMPACT] [MARKET_EFFECT]"
    }
  ],
  "marketChallenges": [
    {
      "challenge": "[CHALLENGE_NAME] (e.g., 'Regulatory Compliance')",
      "description": "[CHALLENGE_DETAILS] [MARKET_IMPLICATIONS]",
      "impact": "[BUSINESS_IMPACT] [MARKET_EFFECT]",
      "mitigation": "[MITIGATION_STRATEGY] [IMPLEMENTATION_APPROACH]"
    }
  ]
}

Example Response (for reference only):
{
  "totalAddressableMarket": {
    "size": "$500B",
    "description": "The global healthcare services market encompasses all medical care delivery, including hospitals, clinics, and home care services. Growing at 8.5% CAGR, driven by aging populations and increased healthcare spending.",
    "methodology": "Based on WHO healthcare spending data, industry reports from McKinsey and Deloitte, validated against regional market analyses."
  },
  "serviceableAddressableMarket": {
    "size": "$100B",
    "description": "The home healthcare services segment focuses on post-acute care, chronic disease management, and elderly care services in developed markets.",
    "limitations": [
      "Initial focus on US, Canada, and Western Europe markets",
      "Regulatory requirements vary by region",
      "Limited to regions with strong internet infrastructure"
    ]
  },
  "serviceableObtainableMarket": {
    "size": "$10B",
    "description": "Targeting urban areas in the US initially, focusing on post-acute care and chronic disease management segments.",
    "timeframe": "3-5 years",
    "assumptions": [
      "5% market penetration in target regions",
      "Limited initial competition from established players",
      "Steady expansion across major metropolitan areas"
    ]
  },
  "growthRate": {
    "current": "15%",
    "projected": "20%",
    "factors": [
      "Increasing elderly population requiring home care",
      "Rising healthcare costs driving home care adoption",
      "Technology adoption enabling remote care delivery"
    ]
  },
  "marketTrends": [
    {
      "trend": "Shift to Remote Healthcare",
      "description": "Accelerating adoption of telehealth and remote monitoring solutions",
      "impact": "Expected to drive 30% of home healthcare delivery within 2 years",
      "timeframe": "2-3 years"
    }
  ],
  "marketDrivers": [
    {
      "driver": "Aging Population",
      "description": "65+ population growing at 3% annually in target markets",
      "impact": "Drives 40% of market growth in home healthcare services"
    }
  ],
  "marketChallenges": [
    {
      "challenge": "Regulatory Compliance",
      "description": "Complex healthcare regulations and licensing requirements",
      "impact": "Increases operational costs by 15-20%",
      "mitigation": "Partnership with regulatory compliance experts and phased regional expansion"
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
  // Extract projections from TAM and SAM data
  const projections = [
    { year: '2024', value: `$${data.SAM.statistics.size['2024']}B` },
    { year: '2025', value: `$${data.TAM.statistics.size['2025']}B` },
    { year: '2030', value: `$${data.TAM.statistics.size['2030']}B` }
  ];

  // Create a comprehensive analysis string
  const analysis = `The total addressable market (TAM) for healthcare services is projected to reach $${data.TAM.statistics.size['2030']}B by 2030. The serviceable addressable market (SAM) shows a CAGR of ${data.SAM.statistics.growthRate}%, with ${data.SAM.statistics.focus}. The serviceable obtainable market (SOM) is estimated at ${data.SOM.statistics.captureEstimate} with ${data.SOM.statistics.realisticGrowth}.`;

  return {
    status: 'completed',
    error: undefined,
    sectionId: 'market-size-growth',
    createdAt: new Date(),
    updatedAt: new Date(),
    marketSize: {
      total: `$${data.TAM.statistics.size['2025']}B`,
      addressable: `$${data.SAM.statistics.size['2024']}B`,
      obtainable: `$${data.SOM.statistics.marketSize['2025']}B`,
      growth: `${data.SAM.statistics.growthRate}% CAGR`,
      analysis,
      projections
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

      // Transform and return the data
      const transformedData = transformMarketSizeGrowthData(parsedData);
      console.log('Transformed market size growth data:', transformedData);
      return transformedData;

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