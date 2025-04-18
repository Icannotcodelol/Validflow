import { UserInput } from "../types";
import { queryPerplexity } from "@/utils/ai-clients";
import { MarketSizeGrowthSchema } from "../models";
import { MarketSizeGrowthData, TargetUsersData } from "@/types/sections";

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isRetryableError(error: any): boolean {
  if (!error) return false;
  
  // Check error message
  const errorMessage = error.message?.toLowerCase() || '';
  if (
    errorMessage.includes('fetch failed') ||
    errorMessage.includes('network error') ||
    errorMessage.includes('timeout') ||
    errorMessage.includes('econnreset') ||
    errorMessage.includes('socket hang up')
  ) {
    return true;
  }

  // Check status code
  const statusCode = error.status || error.statusCode;
  if (statusCode === 429 || statusCode === 529) {
    return true;
  }

  return false;
}

async function retryWithBackoff(operation: () => Promise<any>): Promise<any> {
  let lastError;
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (!isRetryableError(error) || i === MAX_RETRIES - 1) {
        throw error;
      }
      console.log(`Retry attempt ${i + 1} after error:`, error);
      await sleep(RETRY_DELAY * Math.pow(2, i));
    }
  }
  throw lastError;
}

interface TargetUsersResponse {
  primaryUserPersonas: Array<{
    name: string;
    description: string;
    painPoints: string[];
    needs: string[];
    behaviors: string[];
  }>;
  userSegments: Array<{
    segment: string;
    size: string;
    characteristics: string[];
  }>;
  userAcquisitionStrategy: string;
  userRetentionStrategy: string;
}

function validateTargetUsersResponse(data: any): data is TargetUsersResponse {
  if (!data || typeof data !== 'object') return false;

  // Initialize missing objects with empty defaults
  data.primaryUserPersonas = data.primaryUserPersonas || [];
  data.userSegments = data.userSegments || [];
  data.userAcquisitionStrategy = data.userAcquisitionStrategy || '';
  data.userRetentionStrategy = data.userRetentionStrategy || '';

  // Validate primary user personas
  if (!Array.isArray(data.primaryUserPersonas)) return false;
  data.primaryUserPersonas = data.primaryUserPersonas.map((persona: any) => ({
    name: persona.name || '',
    description: persona.description || '',
    painPoints: Array.isArray(persona.painPoints) ? persona.painPoints : [],
    needs: Array.isArray(persona.needs) ? persona.needs : [],
    behaviors: Array.isArray(persona.behaviors) ? persona.behaviors : []
  }));

  // Validate user segments
  if (!Array.isArray(data.userSegments)) return false;
  data.userSegments = data.userSegments.map((segment: any) => ({
    segment: segment.segment || '',
    size: segment.size || '',
    characteristics: Array.isArray(segment.characteristics) ? segment.characteristics : []
  }));

  // Validate strategies
  if (typeof data.userAcquisitionStrategy !== 'string') return false;
  if (typeof data.userRetentionStrategy !== 'string') return false;

  return true;
}

function generateTargetUsersPrompt(input: UserInput): string {
  return `You are a market research expert specializing in user segmentation and persona development. Analyze the following business idea and provide a detailed target users analysis in JSON format.

IMPORTANT: You MUST return ONLY a valid JSON object. Do not include any explanations, markdown, or additional text.

Business Details:
Industry: ${input.industry}
Sub-industry: ${input.subIndustry}
Target Customers: ${input.targetCustomers}
Description: ${input.description}
Current Stage: ${input.currentStage}
Team: ${input.teamComposition}
Pricing Model: ${input.pricingModel}
${input.additionalInfo ? `Additional Info: ${input.additionalInfo}` : ''}

Return a JSON object with this exact structure:
{
  "primaryUserPersonas": [
    {
      "name": "Persona name (e.g., 'Sarah Chen')",
      "description": "Detailed description of the persona",
      "painPoints": ["Pain point 1", "Pain point 2"],
      "needs": ["Need 1", "Need 2"],
      "behaviors": ["Behavior 1", "Behavior 2"]
    }
  ],
  "userSegments": [
    {
      "segment": "Segment name (e.g., 'Fitness Enthusiasts')",
      "size": "Market size or percentage (e.g., '45%')",
      "characteristics": ["Characteristic 1", "Characteristic 2"]
    }
  ],
  "userAcquisitionStrategy": "Detailed strategy for acquiring users",
  "userRetentionStrategy": "Detailed strategy for retaining users"
}

Requirements:
1. Create realistic and detailed user personas based on market research
2. Identify distinct user segments with clear characteristics
3. Consider demographic and psychographic factors
4. Include specific pain points and needs for each persona
5. Describe observable behaviors and patterns
6. Provide actionable acquisition and retention strategies
7. Base segment sizes on market research or reasonable assumptions
8. Consider industry-specific user patterns
9. Account for different user maturity levels
10. Include both primary and secondary user segments

Remember: Return ONLY the JSON object, no additional text.`;
}

export async function generateTargetUsers(input: UserInput): Promise<TargetUsersData> {
  const prompt = generateTargetUsersPrompt(input);
  const baseResponse = {
    sectionId: 'target-users',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  try {
    console.log('Generating target users analysis with Perplexity...');
    const response = await retryWithBackoff(async () => {
      const result = await queryPerplexity(prompt);
      if (!result.choices?.[0]?.message?.content) {
        throw new Error('Invalid response from Perplexity API');
      }
      return result;
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

      // Validate the parsed data
      if (!validateTargetUsersResponse(parsedData)) {
        console.error('Invalid target users data structure:', parsedData);
        return {
          ...baseResponse,
          status: 'failed',
          error: 'Invalid response structure'
        };
      }

      // Transform and return the data
      return transformTargetUsersData(parsedData);

    } catch (parseError) {
      console.error('Failed to parse target users JSON:', parseError);
      return {
        ...baseResponse,
        status: 'failed',
        error: 'Failed to parse response data'
      };
    }

  } catch (error) {
    console.error('Error generating target users analysis:', error);
    return {
      ...baseResponse,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function transformTargetUsersData(data: any): TargetUsersData {
  // Transform user personas
  const primaryUserPersonas = data.user_personas.map((persona: any) => ({
    name: persona.segment,
    description: `${persona.segment} - ${persona.demographics.age} years old, ${persona.demographics.location}, ${persona.demographics.income_level} income. ${persona.psychographics.lifestyle}. Values: ${persona.psychographics.values}.`,
    painPoints: persona.pain_points,
    needs: persona.needs,
    behaviors: [persona.psychographics.behaviors]
  }));

  // Transform user segments
  const userSegments = data.user_personas.map((persona: any) => ({
    segment: persona.segment,
    size: persona.demographics.income_level === 'High' ? '30%' : '70%',
    characteristics: [
      `Age: ${persona.demographics.age}`,
      `Location: ${persona.demographics.location}`,
      `Income Level: ${persona.demographics.income_level}`,
      `Values: ${persona.psychographics.values}`,
      `Lifestyle: ${persona.psychographics.lifestyle}`
    ]
  }));

  return {
    status: 'completed',
    error: undefined,
    sectionId: 'target-users',
    createdAt: new Date(),
    updatedAt: new Date(),
    primaryUserPersonas,
    userSegments,
    userAcquisitionStrategy: data.user_acquisition_strategies.strategies.join('\n'),
    userRetentionStrategy: data.user_retention_strategies.join('\n')
  };
} 