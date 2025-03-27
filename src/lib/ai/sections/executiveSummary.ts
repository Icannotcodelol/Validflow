import { UserInput } from "../types";
import { callClaude } from "../claude";
import { validateSection, createFallbackResponse } from "../../../utils/validateSection";
import type { ExecutiveSummaryResponse, ExecutiveSummaryData } from "../../../types/sections";

interface ParsedExecutiveSummary {
  title?: string;
  verdict?: 'positive' | 'negative' | 'neutral';
  score?: number;
  summary?: string;
  keyFindings?: Array<{
    type: 'strength' | 'weakness' | 'opportunity' | 'threat';
    text: string;
  }>;
}

function generateExecutiveSummaryPrompt(input: UserInput): string {
  return `You are a seasoned venture capital analyst with expertise in evaluating early-stage startups. Your task is to write a structured JSON executive summary that objectively analyzes the business potential.

IMPORTANT INSTRUCTIONS:
1. Return ONLY a clean, parsable JSON object
2. Do NOT include any explanations, markdown, or commentary outside the JSON
3. Ensure the response exactly matches the schema below
4. Use objective, data-driven language in the summary and findings

Required JSON Structure:
{
  "title": string (3-12 words, descriptive project title),
  "verdict": "positive" | "negative" | "neutral" (exact string match),
  "score": number (0-100, integer),
  "summary": string (150-300 word analysis paragraph),
  "keyFindings": [
    {
      "type": "strength" | "weakness" | "opportunity" | "threat" (exact string match),
      "text": string (15-50 words per finding)
    }
  ] (2-5 findings total)
}

Business Details:
Description: ${input.description}
Industry: ${input.industry}
Sub-Industry: ${input.subIndustry}
Target Customers: ${input.targetCustomers}
Current Stage: ${input.currentStage}
Team: ${input.teamComposition}
Pricing Model: ${input.pricingModel}
${input.additionalInfo ? `Additional Info: ${input.additionalInfo}` : ''}

Example Response:
{
  "title": "AI-Powered B2B SaaS Platform for Automated Contract Analysis",
  "verdict": "positive",
  "score": 82,
  "summary": "This venture demonstrates strong potential in the growing legal tech market. The AI-powered contract analysis solution addresses a clear pain point for corporate legal departments and law firms, offering significant time and cost savings. The team's technical expertise and industry connections provide a solid foundation. While the market is competitive, the focus on mid-market enterprises and specialized features creates a defensible position. Key risks include AI accuracy requirements and enterprise sales cycles, but the strong product-market fit and scalable SaaS model support a positive outlook.",
  "keyFindings": [
    {
      "type": "strength",
      "text": "Proven technical team with deep expertise in AI and legal domain, supported by existing industry partnerships and early customer validation."
    },
    {
      "type": "opportunity",
      "text": "Growing legal tech market with increasing demand for automation solutions, particularly in the underserved mid-market segment."
    },
    {
      "type": "weakness",
      "text": "Extended sales cycles in enterprise market may impact cash flow and growth trajectory in early stages."
    },
    {
      "type": "threat",
      "text": "Competitive landscape includes both established players and well-funded startups, requiring clear differentiation."
    }
  ]
}`;
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

export async function generateExecutiveSummary(input: UserInput): Promise<ExecutiveSummaryResponse | ExecutiveSummaryData> {
  const prompt = generateExecutiveSummaryPrompt(input);
  
  try {
    console.log('Generating executive summary...');
    
    const response = await retryWithBackoff(async () => {
      try {
        const data = await callClaude(prompt);
        return data;
      } catch (error) {
        console.error('Error in executive summary API call:', error);
        throw error;
      }
    });
    
    // Try to parse the JSON response
    let parsedData: ParsedExecutiveSummary;
    try {
      // Extract JSON from the response if it's wrapped in text
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      parsedData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse executive summary JSON:', parseError);
      return createFallbackResponse('executive-summary', 'Failed to parse response data');
    }

    // Validate the parsed data using our new validation utility
    const [isValid, validatedData, validationError] = validateSection<ExecutiveSummaryResponse>(
      'executive-summary',
      {
        status: 'completed',
        sectionId: 'executive-summary',
        createdAt: new Date(),
        updatedAt: new Date(),
        title: parsedData.title,
        verdict: parsedData.verdict,
        score: parsedData.score,
        summary: parsedData.summary,
        keyFindings: parsedData.keyFindings,
      }
    );

    if (!isValid || !validatedData) {
      console.error('Invalid executive summary data structure:', validationError);
      return createFallbackResponse(
        'executive-summary',
        validationError ? validationError.message : 'Invalid response structure'
      );
    }

    return validatedData;

  } catch (error) {
    console.error('Error generating executive summary:', error);
    return createFallbackResponse(
      'executive-summary',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
} 