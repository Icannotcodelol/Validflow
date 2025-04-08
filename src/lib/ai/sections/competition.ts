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
  return `You are a competitive analysis expert with access to real market data. Analyze the competitive landscape for this business: 

Business Description: "${input.description}"
Industry: ${input.industry}
Sub-Industry: ${input.subIndustry}
Target Customers: ${input.targetCustomers}
Current Stage: ${input.currentStage}
Team: ${input.teamComposition}
Pricing Model: ${input.pricingModel}
${input.additionalInfo ? `Additional Info: ${input.additionalInfo}` : ''}

CRITICAL REQUIREMENTS:
1. ONLY include REAL, VERIFIABLE competitors that you can find concrete evidence for
2. For each competitor, you MUST include:
   - Official website URL
   - Year founded
   - Funding information (if available)
   - Verifiable market presence indicators
3. For market share and metrics:
   - Include source/citation for each metric
   - Indicate confidence level (High|Medium|Low) for each data point
   - Use ranges when exact numbers aren't available
4. For feature comparisons:
   - Only include features you can verify from official sources
   - Include last verification date
   - Note if any information is potentially outdated

Required JSON Structure:
{
  "analysisMetadata": {
    "generatedAt": "ISO date",
    "dataFreshness": "YYYY-MM-DD",
    "confidenceScore": "High|Medium|Low",
    "dataSources": ["source1", "source2"]
  },
  "directCompetitors": [
    {
      "name": "Actual company name",
      "website": "Official URL",
      "founded": "YYYY",
      "description": "Verified description",
      "fundingStatus": {
        "totalRaised": "Amount or Unknown",
        "lastRound": "Date and amount or Unknown",
        "source": "Funding data source"
      },
      "strengths": [
        {
          "point": "Specific strength",
          "evidence": "Verification source",
          "confidence": "High|Medium|Low"
        }
      ],
      "weaknesses": [
        {
          "point": "Specific weakness",
          "evidence": "Verification source",
          "confidence": "High|Medium|Low"
        }
      ],
      "marketShare": {
        "value": "X% or range",
        "source": "Data source",
        "asOf": "YYYY-MM-DD",
        "confidence": "High|Medium|Low"
      },
      "features": {
        "feature1": {
          "supported": true,
          "verificationSource": "URL or source",
          "lastVerified": "YYYY-MM-DD"
        }
      }
    }
  ],
  "indirectCompetitors": [
    {
      "name": "Actual company name",
      "website": "Official URL",
      "description": "Verified description",
      "threatLevel": {
        "level": "High|Medium|Low",
        "justification": "Specific reason with evidence",
        "confidence": "High|Medium|Low"
      }
    }
  ],
  "marketGaps": [
    {
      "gap": "Specific gap",
      "evidence": "Market research or data supporting this gap",
      "confidence": "High|Medium|Low"
    }
  ]
}

VALIDATION REQUIREMENTS:
1. Each competitor MUST be a real, operating company with a verifiable web presence
2. All market share data MUST have a cited source
3. Features MUST be verified from official sources
4. All confidence levels MUST be justified
5. Dates MUST be included for time-sensitive data

If you cannot find verifiable data for a section, mark it as:
{
  "value": "Unavailable",
  "reason": "Specific reason why data couldn't be verified",
  "confidence": "Low"
}

DO NOT:
- Include competitors without verification
- Make assumptions about market share without sources
- List features without verification
- Include any unverified claims`;
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