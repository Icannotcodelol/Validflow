import { analyzeBusinessIdea as researchMarket } from './perplexity';
import { analyzeIdea } from './anthropic';
import { generateContent } from './openai';

interface FormData {
  description: string;
  industry: string;
  subIndustry: string;
  targetCustomers?: string;
  pricingModel?: string;
  currentStage?: string;
  teamComposition?: string;
  additionalInfo?: string;
}

export async function analyzeBusinessIdea(formData: FormData) {
  try {
    // Step 1: Market Research with Perplexity
    console.log('Starting market research...');
    const marketResearch = await researchMarket({
      description: formData.description,
      industry: formData.industry,
      subIndustry: formData.subIndustry,
      targetCustomers: formData.targetCustomers || '',
      pricingModel: formData.pricingModel || '',
      currentStage: formData.currentStage || '',
      teamComposition: formData.teamComposition || '',
      additionalInfo: formData.additionalInfo
    });
    console.log('Market research completed');

    // Parse market research if it's a string
    const parsedMarketResearch = typeof marketResearch === 'string' 
      ? JSON.parse(marketResearch)
      : marketResearch;

    // Step 2: Structured Analysis with Claude
    console.log('Starting analysis...');
    const analysis = await analyzeIdea(
      formData.description,
      JSON.stringify(parsedMarketResearch),
      formData
    );
    console.log('Analysis completed');

    // Parse analysis if it's a string
    const parsedAnalysis = typeof analysis === 'string'
      ? JSON.parse(analysis)
      : analysis;

    // Step 3: Content Generation with GPT-4
    console.log('Generating content...');
    const content = await generateContent(
      formData.description,
      JSON.stringify(parsedMarketResearch),
      JSON.stringify(parsedAnalysis)
    );
    console.log('Content generation completed');

    // Parse content if it's a string
    const parsedContent = typeof content === 'string'
      ? JSON.parse(content)
      : content;

    // Return the parsed results
    return {
      marketResearch: parsedMarketResearch,
      analysis: parsedAnalysis,
      content: parsedContent
    };
  } catch (error) {
    console.error('Error in business idea analysis:', error);
    throw error;
  }
} 