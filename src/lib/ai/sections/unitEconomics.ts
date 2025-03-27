import { UserInput } from "../types";
import { queryPerplexity } from "@/utils/ai-clients";
import { UnitEconomicsData } from "@/types/sections";

interface UnitEconomicsResponse {
  pricing: {
    model: string;
    strategy: string;
    tiers: Array<{
      name: string;
      price: string;
      features: string[];
    }>;
  };
  costs: {
    fixed: Array<{
      name: string;
      amount: string;
      frequency: string;
    }>;
    variable: Array<{
      name: string;
      amount: string;
      unit: string;
    }>;
  };
  metrics: {
    cac: string;
    ltv: string;
    margin: string;
    paybackPeriod: string;
    breakEvenPoint: string;
  };
  projections: Array<{
    period: string;
    revenue: string;
    costs: string;
    profit: string;
  }>;
  analysis: string;
}

function validateUnitEconomicsResponse(data: any): data is UnitEconomicsResponse {
  if (!data || typeof data !== 'object') return false;

  // Initialize missing objects with empty defaults
  data.pricing = data.pricing || { model: '', strategy: '', tiers: [] };
  data.costs = data.costs || { fixed: [], variable: [] };
  data.metrics = data.metrics || {};
  data.projections = data.projections || [];
  data.analysis = data.analysis || '';

  // Validate pricing
  if (typeof data.pricing.model !== 'string') return false;
  if (typeof data.pricing.strategy !== 'string') return false;
  if (!Array.isArray(data.pricing.tiers)) return false;

  // Validate costs
  if (!Array.isArray(data.costs.fixed)) return false;
  if (!Array.isArray(data.costs.variable)) return false;

  // Validate metrics (allow empty strings)
  if (typeof data.metrics.cac !== 'string') return false;
  if (typeof data.metrics.ltv !== 'string') return false;
  if (typeof data.metrics.margin !== 'string') return false;
  if (typeof data.metrics.paybackPeriod !== 'string') return false;
  if (typeof data.metrics.breakEvenPoint !== 'string') return false;

  // Validate projections
  if (!Array.isArray(data.projections)) return false;

  // Validate analysis
  if (typeof data.analysis !== 'string') return false;

  return true;
}

function generateUnitEconomicsPrompt(input: UserInput): string {
  return `You are a financial analyst specializing in startup unit economics. Analyze the following business idea and provide a detailed unit economics analysis in JSON format.

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
  "pricing": {
    "model": "Detailed description of the pricing model (e.g., 'Subscription-based SaaS with tiered pricing')",
    "strategy": "Pricing strategy explanation (e.g., 'Value-based pricing with premium features')",
    "tiers": [
      {
        "name": "Tier name (e.g., 'Basic')",
        "price": "Price point (e.g., '$29/month')",
        "features": ["Feature 1", "Feature 2"]
      }
    ]
  },
  "costs": {
    "fixed": [
      {
        "name": "Cost name (e.g., 'Office Space')",
        "amount": "Cost amount (e.g., '$2,000')",
        "frequency": "Payment frequency (e.g., 'month')"
      }
    ],
    "variable": [
      {
        "name": "Cost name (e.g., 'Server Costs')",
        "amount": "Cost amount (e.g., '$0.50')",
        "unit": "Per unit basis (e.g., 'user/month')"
      }
    ]
  },
  "metrics": {
    "cac": "Customer Acquisition Cost (e.g., '$50')",
    "ltv": "Lifetime Value (e.g., '$500')",
    "margin": "Profit Margin (e.g., '60%')",
    "paybackPeriod": "CAC Payback Period (e.g., '6 months')",
    "breakEvenPoint": "Break-even Analysis (e.g., '1,000 customers')"
  },
  "projections": [
    {
      "period": "Time period (e.g., 'Year 1')",
      "revenue": "Projected revenue (e.g., '$500,000')",
      "costs": "Projected costs (e.g., '$200,000')",
      "profit": "Projected profit (e.g., '$300,000')"
    }
  ],
  "analysis": "Overall analysis and insights"
}

Requirements:
1. All values must be realistic and based on current market data
2. Include specific numbers and percentages where applicable
3. Consider industry-specific costs and pricing models
4. Account for market maturity and competition
5. Include both short-term and long-term projections
6. Consider regulatory and economic factors
7. Base projections on similar companies in the industry
8. Account for team size and operational costs
9. Include typical startup metrics (CAC, LTV, etc.)
10. Consider scalability and growth potential

Remember: Return ONLY the JSON object, no additional text.`;
}

function transformUnitEconomicsData(data: UnitEconomicsResponse): UnitEconomicsData {
  return {
    sectionId: 'unitEconomics',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    pricing: data.pricing,
    costs: data.costs,
    metrics: data.metrics,
    projections: data.projections
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

export async function generateUnitEconomics(input: UserInput): Promise<UnitEconomicsData> {
  const prompt = generateUnitEconomicsPrompt(input);
  const baseResponse = {
    sectionId: 'unitEconomics',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  // Default empty values for required fields
  const emptyValues = {
    pricing: {
      model: '',
      strategy: '',
      tiers: []
    },
    costs: {
      fixed: [],
      variable: []
    },
    metrics: {
      cac: '',
      ltv: '',
      margin: '',
      paybackPeriod: '',
      breakEvenPoint: ''
    },
    projections: []
  };
  
  try {
    console.log('Generating unit economics analysis with Perplexity...');
    
    const response = await retryWithBackoff(async () => {
      try {
        const data = await queryPerplexity(prompt);
        
        if (!data.choices?.[0]?.message?.content) {
          console.error('Invalid Perplexity response structure:', data);
          throw new Error('Invalid response from Perplexity API');
        }
        
        return data;
      } catch (error) {
        console.error('Error in unit economics API call:', error);
        throw error;
      }
    });
    
    // Try to parse the JSON response
    let parsedData: any;
    try {
      const content = response.choices[0].message.content;
      // First try to parse the entire content as JSON
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

      // Initialize missing objects with empty defaults
      parsedData.pricing = parsedData.pricing || {
        model: '',
        strategy: '',
        tiers: []
      };
      parsedData.costs = parsedData.costs || {
        fixed: [],
        variable: []
      };
      parsedData.metrics = parsedData.metrics || {
        cac: '',
        ltv: '',
        margin: '',
        paybackPeriod: '',
        breakEvenPoint: ''
      };
      parsedData.projections = parsedData.projections || [];

      // Validate and fix pricing tiers
      if (!Array.isArray(parsedData.pricing.tiers)) {
        parsedData.pricing.tiers = [];
      }
      parsedData.pricing.tiers = parsedData.pricing.tiers.map((tier: any) => ({
        name: tier.name || 'Unknown Tier',
        price: tier.price || '$0',
        features: Array.isArray(tier.features) ? tier.features : ['Basic features']
      }));

      // Validate and fix costs
      if (!Array.isArray(parsedData.costs.fixed)) {
        parsedData.costs.fixed = [];
      }
      if (!Array.isArray(parsedData.costs.variable)) {
        parsedData.costs.variable = [];
      }

      // Validate the response
      if (!validateUnitEconomicsResponse(parsedData)) {
        throw new Error('Invalid response structure');
      }

      // Transform the data
      return transformUnitEconomicsData(parsedData);

    } catch (parseError) {
      console.error('Failed to parse unit economics JSON:', parseError);
      return {
        ...baseResponse,
        ...emptyValues,
        status: 'failed',
        error: 'Failed to parse response data'
      };
    }

  } catch (error) {
    console.error('Error generating unit economics analysis:', error);
    return {
      ...baseResponse,
      ...emptyValues,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 