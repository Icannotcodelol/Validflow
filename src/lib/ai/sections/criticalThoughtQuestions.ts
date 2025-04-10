import { CriticalThoughtQuestions, UserInput } from '../models';
import Anthropic from '@anthropic-ai/sdk';
  
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
  
const CRITICAL_THOUGHT_QUESTIONS_PROMPT = `You are a strategic advisor. Analyze the following startup idea and provide critical thought questions and risk areas.
  
Startup Details:
Industry: {industry}
Sub-Industry: {subIndustry}
Target Customers: {targetCustomers}
Current Stage: {currentStage}
Description: {description}
  
Please provide a comprehensive analysis of critical questions and risks in JSON format with the following structure:
{
  "questions": [
    {
      "category": "Question category",
      "question": "Critical question",
      "importance": "High|Medium|Low",
      "considerations": [
        "Consideration 1",
        "Consideration 2",
        "Consideration 3"
      ]
    }
  ],
  "riskAreas": [
    {
      "area": "Risk area",
      "description": "Detailed description of the risk",
      "mitigation": "Potential mitigation strategies"
    }
  ]
}
  
Ensure the analysis:
1. Covers key strategic, operational, and market risks
2. Includes both immediate and long-term considerations
3. Provides actionable insights for risk mitigation
4. Addresses potential blind spots and assumptions`;
  
function generateCriticalThoughtQuestionsPrompt(input: UserInput): string {
  return CRITICAL_THOUGHT_QUESTIONS_PROMPT
    .replace('{industry}', input.industry)
    .replace('{subIndustry}', input.subIndustry)
    .replace('{targetCustomers}', input.targetCustomers)
    .replace('{currentStage}', input.currentStage)
    .replace('{description}', input.description);
}
  
interface QuestionInput {
  category: string;
  question: string;
  importance: string;
  considerations?: string[];
}

function transformCriticalThoughtQuestionsData(data: { questions: QuestionInput[] } & Partial<CriticalThoughtQuestions>): CriticalThoughtQuestions {
  // Group questions by category and transform them to the expected format
  const groupedQuestions = data.questions.reduce((acc: Record<string, Array<{
    question: string;
    importance: 'high' | 'medium' | 'low';
    context?: string;
  }>>, q: QuestionInput) => {
    if (!acc[q.category]) {
      acc[q.category] = [];
    }
    acc[q.category].push({
      question: q.question,
      importance: q.importance.toLowerCase() as 'high' | 'medium' | 'low',
      context: q.considerations?.join('. ')
    });
    return acc;
  }, {});

  // Transform to the final format
  return {
    status: data.status || 'completed',
    error: data.error,
    sectionId: data.sectionId || '',
    createdAt: data.createdAt || new Date(),
    updatedAt: data.updatedAt || new Date(),
    questions: Object.entries(groupedQuestions).map(([category, questions]) => ({
      category,
      questions
    }))
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

export async function generateCriticalThoughtQuestions(input: UserInput): Promise<CriticalThoughtQuestions> {
  try {
    const prompt = generateCriticalThoughtQuestionsPrompt(input);
  
    const response = await retryWithBackoff(async () => {
      try {
        const data = await anthropic.messages.create({
          model: 'claude-3-opus-20240229',
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }],
        });
        
        const content = data.content[0].type === 'text' 
          ? data.content[0].text 
          : JSON.stringify(data.content[0]);
        
        return content;
      } catch (error) {
        console.error('Error in critical thought questions API call:', error);
        throw error;
      }
    });
  
    // Try to extract JSON if the response contains surrounding text
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsedJson = JSON.parse(jsonMatch[0]);
        return transformCriticalThoughtQuestionsData(parsedJson);
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
      }
    }
  
    // Retry with a simplified prompt
    const retryResponse = await retryWithBackoff(async () => {
      try {
        const data = await anthropic.messages.create({
          model: 'claude-3-opus-20240229',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: 'Please provide a valid JSON object with the following structure:\n' +
                JSON.stringify({
                  questions: [{
                    category: '',
                    question: '',
                    importance: 'Medium',
                    considerations: []
                  }],
                  riskAreas: [{
                    area: '',
                    description: '',
                    mitigation: ''
                  }]
                }, null, 2)
            }
          ],
        });
        
        return data.content[0].type === 'text'
          ? data.content[0].text
          : JSON.stringify(data.content[0]);
      } catch (error) {
        console.error('Error in critical thought questions retry API call:', error);
        throw error;
      }
    });
  
    const retryData = JSON.parse(retryResponse);
    return transformCriticalThoughtQuestionsData(retryData);
  
  } catch (error) {
    console.error('Error generating critical thought questions:', error);
    throw error;
  }
} 