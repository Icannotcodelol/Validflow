import { UserInput } from "../types";
import { queryPerplexity } from "@/utils/ai-clients";
import { CompetitionData } from "@/types/sections";

interface CompetitionResponse {
  directCompetitors: Array<{
    name: string;
    description: string;
    strengths: string[];
    weaknesses: string[];
    marketShare?: string;
  }>;
  indirectCompetitors: Array<{
    name: string;
    description: string;
    threatLevel: 'High' | 'Medium' | 'Low';
  }>;
  competitiveAdvantages: string[];
  marketGaps: string[];
}

function validateCompetitionResponse(data: any): data is CompetitionResponse {
  if (!data || typeof data !== 'object') return false;

  // Validate direct competitors
  if (!Array.isArray(data.directCompetitors) || data.directCompetitors.length === 0) return false;
  
  const validDirectCompetitor = (competitor: any) => {
    if (!competitor || typeof competitor !== 'object') return false;
    if (typeof competitor.name !== 'string' || !competitor.name.trim()) return false;
    if (typeof competitor.description !== 'string' || !competitor.description.trim()) return false;
    if (!Array.isArray(competitor.strengths) || competitor.strengths.length === 0) return false;
    if (!Array.isArray(competitor.weaknesses) || competitor.weaknesses.length === 0) return false;
    if (competitor.marketShare && typeof competitor.marketShare !== 'string') return false;
    return true;
  };

  if (!data.directCompetitors.every(validDirectCompetitor)) return false;

  // Validate indirect competitors
  if (!Array.isArray(data.indirectCompetitors)) return false;
  
  const validIndirectCompetitor = (competitor: any) => {
    if (!competitor || typeof competitor !== 'object') return false;
    if (typeof competitor.name !== 'string' || !competitor.name.trim()) return false;
    if (typeof competitor.description !== 'string' || !competitor.description.trim()) return false;
    if (!['High', 'Medium', 'Low'].includes(competitor.threatLevel)) return false;
    return true;
  };

  if (!data.indirectCompetitors.every(validIndirectCompetitor)) return false;

  // Validate competitive advantages
  if (!Array.isArray(data.competitiveAdvantages) || data.competitiveAdvantages.length === 0) return false;
  if (!data.competitiveAdvantages.every((adv: unknown) => typeof adv === 'string' && adv.trim() !== '')) return false;

  // Validate market gaps
  if (!Array.isArray(data.marketGaps) || data.marketGaps.length === 0) return false;
  if (!data.marketGaps.every((gap: unknown) => typeof gap === 'string' && gap.trim() !== '')) return false;

  return true;
}

function generateCompetitionPrompt(input: UserInput): string {
  return `You are a competitive analysis expert. Analyze the competitive landscape for this business: 

Business Description: "${input.description}"
Industry: ${input.industry}
Sub-Industry: ${input.subIndustry}
Target Customers: ${input.targetCustomers}
Current Stage: ${input.currentStage}
Team: ${input.teamComposition}
Pricing Model: ${input.pricingModel}
${input.additionalInfo ? `Additional Info: ${input.additionalInfo}` : ''}

IMPORTANT INSTRUCTIONS:
1. ONLY include REAL, VERIFIABLE competitors - do not make up or hallucinate competitors
2. Base ALL analysis on the provided business details and current market reality
3. Be specific and quantitative where possible (e.g., actual market share percentages)
4. Focus on the most relevant 3-5 direct competitors and 2-3 indirect competitors
5. Ensure competitive advantages and market gaps are realistic and achievable
6. Include detailed feature comparison and market positioning analysis
7. Format your response as a clean JSON object with NO additional text or markdown

Required JSON Structure:
{
  "directCompetitors": [
    {
      "name": "Actual company name",
      "description": "Specific description of their business model and target market",
      "strengths": ["Quantifiable or specific strength 1", "Quantifiable or specific strength 2"],
      "weaknesses": ["Specific weakness 1", "Specific weakness 2"],
      "marketShare": "Actual market share percentage or range if available",
      "features": {
        "feature1": {
          "supported": true,
          "notes": "Optional notes about implementation"
        }
      },
      "pricing": {
        "model": "Subscription/One-time/etc",
        "startingPrice": "$X/month",
        "enterprise": "Custom/Contact Sales/etc"
      },
      "marketPosition": {
        "pricingTier": "premium|mid-market|economy",
        "featureTier": "basic|advanced|enterprise",
        "targetSegment": ["segment1", "segment2"]
      }
    }
  ],
  "indirectCompetitors": [
    {
      "name": "Actual company name",
      "description": "Specific description of their business and indirect competition",
      "threatLevel": "High|Medium|Low",
      "overlapAreas": ["Area of overlap 1", "Area of overlap 2"]
    }
  ],
  "competitiveAdvantages": [
    "Specific, achievable advantage 1",
    "Specific, achievable advantage 2"
  ],
  "marketGaps": [
    "Specific, verifiable market gap 1",
    "Specific, verifiable market gap 2"
  ],
  "featureComparison": {
    "features": ["Feature 1", "Feature 2", "Feature 3"],
    "comparisonMatrix": {
      "CompetitorName1": {
        "Feature 1": true,
        "Feature 2": false
      }
    }
  },
  "marketPositioning": {
    "axisX": {
      "label": "Price",
      "min": "Low Cost",
      "max": "Premium"
    },
    "axisY": {
      "label": "Feature Set",
      "min": "Basic",
      "max": "Advanced"
    },
    "positions": [
      {
        "competitor": "CompetitorName1",
        "x": 80,
        "y": 60
      }
    ]
  }
}

VALIDATION RULES:
- All competitor names must be real companies
- Market share should be specific percentages or ranges
- Threat levels must be one of: "High", "Medium", "Low"
- Each strength/weakness must be specific and verifiable
- Competitive advantages must be realistic and achievable
- Market gaps must be based on actual market research
- Features must be specific and relevant to the industry
- Market positioning scores must be between 0-100

DO NOT:
- Include generic descriptions
- Make up or hallucinate competitors
- Use vague or unverifiable claims
- Include advantages that aren't realistically achievable
- Add any text outside the JSON structure`;
}

function transformCompetitionData(data: CompetitionResponse): CompetitionData {
  return {
    status: 'completed',
    error: undefined,
    sectionId: 'competition',
    createdAt: new Date(),
    updatedAt: new Date(),
    directCompetitors: data.directCompetitors,
    indirectCompetitors: data.indirectCompetitors,
    competitiveAdvantages: data.competitiveAdvantages,
    marketGaps: data.marketGaps
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

export async function generateCompetition(input: UserInput): Promise<CompetitionData> {
  const prompt = generateCompetitionPrompt(input);
  
  try {
    console.log('Generating competition analysis with Perplexity...');
    
    const response = await retryWithBackoff(async () => {
      try {
        const data = await queryPerplexity(prompt);
        
        if (!data.choices?.[0]?.message?.content) {
          console.error('Invalid Perplexity response structure:', data);
          throw new Error('Invalid response from Perplexity API');
        }
        
        return data;
      } catch (error) {
        console.error('Error in competition API call:', error);
        throw error;
      }
    });
    
    // Try to parse the JSON response
    try {
      const content = response.choices[0].message.content;
      // First try to parse the entire content as JSON
      let parsedData: any;
      try {
        parsedData = JSON.parse(content);
      } catch {
        // If that fails, try to extract JSON from the content
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }
        parsedData = JSON.parse(jsonMatch[0]);
      }

      // Ensure the parsed data has the required structure
      if (!parsedData || typeof parsedData !== 'object') {
        throw new Error('Invalid JSON structure');
      }

      // Ensure all required arrays exist
      parsedData.directCompetitors = parsedData.directCompetitors || [];
      parsedData.indirectCompetitors = parsedData.indirectCompetitors || [];
      parsedData.competitiveAdvantages = parsedData.competitiveAdvantages || [];
      parsedData.marketGaps = parsedData.marketGaps || [];

      // Validate each competitor has required fields
      parsedData.directCompetitors = parsedData.directCompetitors.map((comp: any) => ({
        name: comp.name || 'Unknown Competitor',
        description: comp.description || 'No description available',
        strengths: Array.isArray(comp.strengths) ? comp.strengths : ['No strengths listed'],
        weaknesses: Array.isArray(comp.weaknesses) ? comp.weaknesses : ['No weaknesses listed'],
        marketShare: comp.marketShare || 'Market share not available'
      }));

      parsedData.indirectCompetitors = parsedData.indirectCompetitors.map((comp: any) => ({
        name: comp.name || 'Unknown Competitor',
        description: comp.description || 'No description available',
        threatLevel: ['High', 'Medium', 'Low'].includes(comp.threatLevel) ? comp.threatLevel : 'Medium'
      }));

      // Validate the parsed data
      if (!validateCompetitionResponse(parsedData)) {
        console.error('Invalid competition data structure:', parsedData);
        return {
          status: 'failed',
          error: 'Invalid response structure',
          sectionId: 'competition',
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }

      // Transform the data to the expected format
      return transformCompetitionData(parsedData);

    } catch (parseError) {
      console.error('Failed to parse competition JSON:', parseError);
      return {
        status: 'failed',
        error: 'Failed to parse response data',
        sectionId: 'competition',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

  } catch (error) {
    console.error('Error generating competition analysis:', error);
    return {
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      sectionId: 'competition',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
} 