import { Analysis, AnalysisInput } from "@/lib/models/analysis";
import { queryPerplexity, queryClaude, queryGPT4 } from "@/utils/ai-clients";

interface MarketResearch {
  marketSize: {
    total: string;
    addressable: string;
    obtainable: string;
    growth: string;
  };
  demographics: {
    primarySegments: string[];
    characteristics: string[];
  };
  trends: Array<{
    name: string;
    description: string;
    impact: string;
  }>;
  competitors: Array<{
    name: string;
    type: string;
    marketShare: string;
  }>;
  regulations: Array<{
    type: string;
    description: string;
    impact: string;
  }>;
  marketDynamics: {
    entryBarriers: string[];
    supplierPower: string;
    buyerPower: string;
  };
}

interface BusinessAnalysis {
  executiveSummary: {
    title: string;
    verdict: string;
    score: number;
    summary: string;
  };
  valueProposition: {
    uniqueness: string;
    sustainability: string;
    scalability: string;
  };
  marketFit: {
    needAlignment: string;
    timingAnalysis: string;
    competitiveAdvantage: string;
  };
  financialAnalysis: {
    revenueStreams: string[];
    costStructure: string[];
    projections: string[];
  };
  riskAssessment: {
    marketRisks: string[];
    operationalRisks: string[];
    financialRisks: string[];
  };
  implementationPlan: {
    phases: string[];
    criticalPath: string[];
    keyMetrics: string[];
  };
}

interface AnalyzeBusinessIdeaInput {
  description: string;
  industry: string;
  subIndustry: string;
  targetCustomers: string;
  pricingModel: string;
  currentStage: string;
  teamComposition: string;
  additionalInfo?: string;
}

interface AnalyzeBusinessIdeaOutput {
  marketResearch: MarketResearch;
  analysis: BusinessAnalysis;
}

export async function analyzeBusinessIdea(input: AnalyzeBusinessIdeaInput): Promise<AnalyzeBusinessIdeaOutput> {
  try {
    // Step 1: Market Research with Perplexity's sonar-deep-research
    const marketResearchPrompt = `You are a market research expert. Analyze this business idea and provide market research in JSON format:

Business Idea: ${input.description}
Industry: ${input.industry}
Sub-industry: ${input.subIndustry}
Target Customers: ${input.targetCustomers}

Provide a JSON response with:
- marketSize (total, addressable, obtainable, growth)
- demographics (primary segments, characteristics)
- trends (name, description, impact)
- competitors (name, type, market share)
- regulations (type, description, impact)
- marketDynamics (entryBarriers, supplierPower, buyerPower)`;

    const marketResearchResponse = await queryPerplexity(marketResearchPrompt);
    
    if (!marketResearchResponse.choices?.[0]?.message?.content) {
      console.error('Invalid Perplexity response structure:', marketResearchResponse);
      throw new Error('Invalid response from Perplexity API');
    }

    let marketResearch: MarketResearch;
    try {
      const content = marketResearchResponse.choices[0].message.content;
      marketResearch = JSON.parse(content) as MarketResearch;
      
      // Validate required fields
      const requiredFields = ['marketSize', 'demographics', 'trends', 'competitors', 'regulations', 'marketDynamics'];
      const missingFields = requiredFields.filter(field => !marketResearch[field as keyof MarketResearch]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields in market research: ${missingFields.join(', ')}`);
      }
    } catch (parseError) {
      console.error('Failed to parse market research response:', {
        error: parseError,
        content: marketResearchResponse.choices[0].message.content
      });
      throw new Error('Failed to parse market research response');
    }

    // Step 2: Business Analysis with Claude 3.5 Sonnet
    const analysisPrompt = `You are a business analyst. Analyze this business idea and provide analysis in JSON format:

Business Idea: ${input.description}
Industry: ${input.industry}
Sub-industry: ${input.subIndustry}
Target Customers: ${input.targetCustomers}
Pricing Model: ${input.pricingModel}
Current Stage: ${input.currentStage}
Team Composition: ${input.teamComposition}

Market Research Context: ${JSON.stringify(marketResearch)}

Provide a JSON response with:
- executiveSummary (title, verdict, score, summary)
- valueProposition (uniqueness, sustainability, scalability)
- marketFit (needAlignment, timingAnalysis, competitiveAdvantage)
- financialAnalysis (revenueStreams, costStructure, projections)
- riskAssessment (marketRisks, operationalRisks, financialRisks)
- implementationPlan (phases, criticalPath, keyMetrics)`;

    const analysisResponse = await queryClaude(analysisPrompt);
    
    if (!analysisResponse.content?.[0]) {
      console.error('Invalid Claude response structure:', analysisResponse);
      throw new Error('Invalid response from Claude API');
    }

    let analysis: BusinessAnalysis;
    try {
      const content = analysisResponse.content[0] as { type: string; text?: string };
      if (content.type !== 'text') {
        throw new Error(`Unexpected content type: ${content.type}`);
      }
      if (!content.text) {
        throw new Error('No text content in Claude response');
      }
      analysis = JSON.parse(content.text) as BusinessAnalysis;
      
      // Validate required fields
      const requiredFields = ['executiveSummary', 'valueProposition', 'marketFit', 'financialAnalysis', 'riskAssessment', 'implementationPlan'];
      const missingFields = requiredFields.filter(field => !analysis[field as keyof BusinessAnalysis]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields in analysis: ${missingFields.join(', ')}`);
      }
    } catch (parseError) {
      console.error('Failed to parse analysis response:', {
        error: parseError,
        content: analysisResponse.content[0]
      });
      throw new Error('Failed to parse analysis response');
    }

    return {
      marketResearch,
      analysis
    };
  } catch (error) {
    console.error('Error in analyzeBusinessIdea:', error);
    throw error;
  }
} 