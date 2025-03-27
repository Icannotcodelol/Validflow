import { UserInput } from '../types';
import OpenAI from 'openai';
import { GoToMarketPlanSchema } from '../models';
import { GoToMarketPlanData } from '@/types/sections';

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

interface GoToMarketPlanResponse {
  launchStrategy: {
    phases: Array<{
      phase: string;
      timeline: string;
      activities: string[];
      metrics: string[];
    }>;
  };
  keyPartnerships: Array<{
    partner: string;
    type: string;
    value: string;
  }>;
  resourceRequirements: {
    team: string[];
    budget: string;
    technology: string[];
  };
}

function validateGoToMarketPlanResponse(data: any): data is GoToMarketPlanResponse {
  if (!data || typeof data !== 'object') return false;

  // Validate launchStrategy
  if (!data.launchStrategy || typeof data.launchStrategy !== 'object') return false;
  if (!Array.isArray(data.launchStrategy.phases)) return false;
  
  const validPhase = (phase: any) => {
    if (!phase || typeof phase !== 'object') return false;
    if (typeof phase.phase !== 'string' || !phase.phase.trim()) return false;
    if (typeof phase.timeline !== 'string' || !phase.timeline.trim()) return false;
    if (!Array.isArray(phase.activities) || phase.activities.length === 0) return false;
    if (!Array.isArray(phase.metrics) || phase.metrics.length === 0) return false;
    return true;
  };

  if (!data.launchStrategy.phases.every(validPhase)) return false;

  // Validate keyPartnerships
  if (!Array.isArray(data.keyPartnerships)) return false;
  
  const validPartnership = (partnership: any) => {
    if (!partnership || typeof partnership !== 'object') return false;
    if (typeof partnership.partner !== 'string' || !partnership.partner.trim()) return false;
    if (typeof partnership.type !== 'string' || !partnership.type.trim()) return false;
    if (typeof partnership.value !== 'string' || !partnership.value.trim()) return false;
    return true;
  };

  if (!data.keyPartnerships.every(validPartnership)) return false;

  // Validate resourceRequirements
  if (!data.resourceRequirements || typeof data.resourceRequirements !== 'object') return false;
  if (!Array.isArray(data.resourceRequirements.team)) return false;
  if (typeof data.resourceRequirements.budget !== 'string' || !data.resourceRequirements.budget.trim()) return false;
  if (!Array.isArray(data.resourceRequirements.technology)) return false;

  return true;
}

function generateGoToMarketPlanPrompt(input: UserInput): string {
  return `You are a go-to-market strategy analyst. Your task is to analyze the following business and provide a detailed go-to-market plan.

IMPORTANT: You MUST return ONLY a valid JSON object. Do not include any explanations, markdown, or additional text.
DO NOT include any text before or after the JSON object.
DO NOT use markdown code blocks or backticks.
DO NOT include any comments or explanations.

Business Details:
Industry: ${input.industry}
Sub-Industry: ${input.subIndustry}
Target Customers: ${input.targetCustomers}
Current Stage: ${input.currentStage}
Description: ${input.description}
Team: ${input.teamComposition}
Pricing Model: ${input.pricingModel}
${input.additionalInfo ? `Additional Info: ${input.additionalInfo}` : ''}

Return a JSON object with this exact structure:
{
  "launchStrategy": {
    "phases": [
      {
        "phase": "Phase name",
        "timeline": "Expected timeline",
        "activities": [
          "Activity 1",
          "Activity 2",
          "Activity 3"
        ],
        "metrics": [
          "Metric 1",
          "Metric 2",
          "Metric 3"
        ]
      }
    ]
  },
  "keyPartnerships": [
    {
      "partner": "Partner name",
      "type": "Partnership type",
      "value": "Value proposition"
    }
  ],
  "resourceRequirements": {
    "team": [
      "Team role 1",
      "Team role 2",
      "Team role 3"
    ],
    "budget": "Required budget breakdown",
    "technology": [
      "Technology requirement 1",
      "Technology requirement 2",
      "Technology requirement 3"
    ]
  }
}

Requirements for the plan:
1. Aligned with the business's current stage
2. Based on industry best practices
3. Includes specific timelines and milestones
4. Provides clear resource requirements
5. Adaptable to the specific industry and business model
6. Focuses on realistic and achievable goals
7. Includes industry-specific metrics and KPIs

CRITICAL: Return ONLY the JSON object, with no additional text, markdown, or formatting.`;
}

export async function generateGoToMarketPlan(input: UserInput): Promise<GoToMarketPlanData> {
  try {
    const prompt = generateGoToMarketPlanPrompt(input);

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
        console.log('Raw go-to-market plan response:', content);
        
        // Try to parse the response
        let parsedData;
        try {
          parsedData = JSON.parse(content);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          throw new Error('Invalid JSON response from AI service');
        }

        // Validate the response structure
        if (!validateGoToMarketPlanResponse(parsedData)) {
          throw new Error('Invalid response structure from AI service');
        }

        return parsedData;
      } catch (error) {
        console.error('Error in go-to-market plan generation:', error);
        throw error;
      }
    });

    return {
      status: 'completed',
      sectionId: 'goToMarketPlan',
      createdAt: new Date(),
      updatedAt: new Date(),
      launchStrategy: response.launchStrategy,
      keyPartnerships: response.keyPartnerships,
      resourceRequirements: response.resourceRequirements
    };

  } catch (error) {
    console.error('Error generating go-to-market plan:', error);
    return {
      status: 'failed',
      error: error instanceof Error ? error.message : 'Failed to generate go-to-market plan',
      sectionId: 'goToMarketPlan',
      createdAt: new Date(),
      updatedAt: new Date(),
      launchStrategy: { phases: [] },
      keyPartnerships: [],
      resourceRequirements: {
        team: [],
        budget: '',
        technology: []
      }
    };
  }
} 