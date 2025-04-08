import { UserInput } from "../types";
import { queryPerplexity } from "@/utils/ai-clients";
import { VCSentimentData } from "@/types/sections";

interface VCSentimentResponse {
  overview: {
    score: number;
    confidence: number;
    summary: string;
    verdict: string;
  };
  investmentAttractiveness: {
    score: number;
    confidence: number;
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  marketActivity: {
    investmentVolume: {
      total: string;
      timeframe: string;
      trend: string;
      growth: string;
      analysis: string;
    };
    notableTransactions: Array<{
      date: string;
      company: string;
      round: string;
      amount: string;
      investors: string[];
      valuation?: string;
    }>;
    comparableExits: Array<{
      company: string;
      date: string;
      type: string;
      value: string;
      details: string;
    }>;
  };
  marketTrends: {
    overview: string;
    trends: Array<{
      name: string;
      impact: string;
      timeline: string;
    }>;
    investorSentiment: {
      overall: string;
      keyFactors: string[];
      concerns: string[];
      outlook: string;
    };
  };
  fundingStrategy: {
    recommendedRound: {
      type: string;
      targetAmount: string;
      timing: string;
      valuation: {
        range: string;
        basis: string[];
      };
    };
    useOfFunds: Array<{
      category: string;
      allocation: string;
      details: string;
    }>;
    targetInvestors: Array<{
      type: string;
      focus: string[];
      examples: string[];
    }>;
    milestones: Array<{
      milestone: string;
      timeline: string;
      impact: string;
    }>;
  };
}

function validateVCSentimentResponse(data: any): data is VCSentimentResponse {
  try {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data structure: root must be an object');
    }

    // Helper function to validate string arrays
    const isValidStringArray = (arr: any) => Array.isArray(arr) && arr.every(item => typeof item === 'string' && item.trim().length > 0);
    
    // Helper function to validate numbers between 0-100
    const isValidScore = (score: any) => typeof score === 'number' && score >= 0 && score <= 100;

    // Validate overview
    const overview = data.overview;
    if (!overview || typeof overview !== 'object') {
      throw new Error('Missing or invalid overview section');
    }
    if (!isValidScore(overview.score)) {
      throw new Error('Invalid overview score');
    }
    if (!isValidScore(overview.confidence)) {
      throw new Error('Invalid overview confidence score');
    }
    if (typeof overview.summary !== 'string' || overview.summary.trim().length === 0) {
      throw new Error('Missing or invalid overview summary');
    }
    if (typeof overview.verdict !== 'string' || overview.verdict.trim().length === 0) {
      throw new Error('Missing or invalid overview verdict');
    }

    // Validate investment attractiveness
    const inv = data.investmentAttractiveness;
    if (!inv || typeof inv !== 'object') {
      throw new Error('Missing or invalid investment attractiveness section');
    }
    if (!isValidScore(inv.score)) {
      throw new Error('Invalid investment attractiveness score');
    }
    if (!isValidScore(inv.confidence)) {
      throw new Error('Invalid investment attractiveness confidence score');
    }
    if (!isValidStringArray(inv.strengths)) {
      throw new Error('Invalid strengths array');
    }
    if (!isValidStringArray(inv.weaknesses)) {
      throw new Error('Invalid weaknesses array');
    }
    if (!isValidStringArray(inv.opportunities)) {
      throw new Error('Invalid opportunities array');
    }
    if (!isValidStringArray(inv.threats)) {
      throw new Error('Invalid threats array');
    }

    // Validate market activity
    const ma = data.marketActivity;
    if (!ma || typeof ma !== 'object') {
      throw new Error('Missing or invalid market activity section');
    }
    if (!ma.investmentVolume || typeof ma.investmentVolume !== 'object') {
      throw new Error('Missing or invalid investment volume data');
    }
    if (typeof ma.investmentVolume.total !== 'string' || !ma.investmentVolume.total.trim()) {
      throw new Error('Missing or invalid investment volume total');
    }
    if (!Array.isArray(ma.notableTransactions)) {
      throw new Error('Invalid notable transactions array');
    }
    if (!Array.isArray(ma.comparableExits)) {
      throw new Error('Invalid comparable exits array');
    }

    // Validate market trends
    const mt = data.marketTrends;
    if (!mt || typeof mt !== 'object') {
      throw new Error('Missing or invalid market trends section');
    }
    if (typeof mt.overview !== 'string' || !mt.overview.trim()) {
      throw new Error('Missing or invalid market trends overview');
    }
    if (!Array.isArray(mt.trends)) {
      throw new Error('Invalid trends array');
    }
    if (!mt.investorSentiment || typeof mt.investorSentiment !== 'object') {
      throw new Error('Missing or invalid investor sentiment data');
    }

    // Validate funding strategy
    const fs = data.fundingStrategy;
    if (!fs || typeof fs !== 'object') {
      throw new Error('Missing or invalid funding strategy section');
    }
    if (!fs.recommendedRound || typeof fs.recommendedRound !== 'object') {
      throw new Error('Missing or invalid recommended round data');
    }
    if (!Array.isArray(fs.useOfFunds)) {
      throw new Error('Invalid use of funds array');
    }
    if (!Array.isArray(fs.targetInvestors)) {
      throw new Error('Invalid target investors array');
    }
    if (!Array.isArray(fs.milestones)) {
      throw new Error('Invalid milestones array');
    }

    return true;
  } catch (error) {
    console.error('[VCSentiment] Validation error:', error);
    return false;
  }
}

function transformVCSentimentData(data: VCSentimentResponse): VCSentimentData {
  return {
    status: 'completed',
    error: undefined,
    sectionId: 'vcSentiment',
    createdAt: new Date(),
    updatedAt: new Date(),
    overview: data.overview,
    investmentAttractiveness: data.investmentAttractiveness,
    marketActivity: data.marketActivity,
    marketTrends: data.marketTrends,
    fundingStrategy: data.fundingStrategy
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

const VC_SENTIMENT_PROMPT = `You are a senior venture capital market analyst expert. Your task is to analyze a business and provide a VC investment analysis report in JSON format.

IMPORTANT: You must ONLY return a valid JSON object. Do not include any other text, markdown, or explanations outside the JSON.

Business Details:
Industry: {industry}
Sub-Industry: {subIndustry}
Target Customers: {targetCustomers}
Current Stage: {currentStage}
Description: {description}

Required JSON structure (replace example values with your analysis):
{
  "overview": {
    "score": 85,
    "confidence": 90,
    "summary": "Clear analysis of the business potential",
    "verdict": "Investment recommendation"
  },
  "investmentAttractiveness": {
    "score": 85,
    "confidence": 90,
    "strengths": ["strength1", "strength2"],
    "weaknesses": ["weakness1", "weakness2"],
    "opportunities": ["opportunity1", "opportunity2"],
    "threats": ["threat1", "threat2"]
  },
  "marketActivity": {
    "investmentVolume": {
      "total": "$9.5B",
      "timeframe": "Last 12 months",
      "trend": "Increasing",
      "growth": "20% YoY",
      "analysis": "Market analysis"
    },
    "notableTransactions": [
      {
        "date": "2024-03",
        "company": "Company Name",
        "round": "Series X",
        "amount": "$50M",
        "investors": ["Investor1", "Investor2"]
      }
    ],
    "comparableExits": [
      {
        "company": "Company Name",
        "date": "2024-01",
        "type": "Acquisition/IPO",
        "value": "$500M",
        "details": "Exit details"
      }
    ]
  },
  "marketTrends": {
    "overview": "Market overview",
    "trends": [
      {
        "name": "Trend Name",
        "impact": "Impact description",
        "timeline": "Timeline"
      }
    ],
    "investorSentiment": {
      "overall": "Overall sentiment",
      "keyFactors": ["factor1", "factor2"],
      "concerns": ["concern1", "concern2"],
      "outlook": "Future outlook"
    }
  },
  "fundingStrategy": {
    "recommendedRound": {
      "type": "Series X",
      "targetAmount": "$10M",
      "timing": "Q2 2024",
      "valuation": {
        "range": "$45M - $55M",
        "basis": ["basis1", "basis2"]
      }
    },
    "useOfFunds": [
      {
        "category": "Category",
        "allocation": "X%",
        "details": "Details"
      }
    ],
    "targetInvestors": [
      {
        "type": "Investor Type",
        "focus": ["focus1", "focus2"],
        "examples": ["example1", "example2"]
      }
    ],
    "milestones": [
      {
        "milestone": "Milestone",
        "impact": "Impact",
        "timeline": "Timeline"
      }
    ]
  }
}`;

function extractJSON(content: string): any {
  try {
    // First try: direct parse after cleaning whitespace
    const cleaned = content.trim();
    if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
      return JSON.parse(cleaned);
    }
    
    // Second try: remove markdown code blocks
    const withoutMarkdown = cleaned.replace(/^```json\s*|\s*```$/g, '');
    if (withoutMarkdown.startsWith('{') && withoutMarkdown.endsWith('}')) {
      return JSON.parse(withoutMarkdown);
    }
    
    // Third try: find the first complete JSON object
    const match = cleaned.match(/\{(?:[^{}]|{[^{}]*})*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    
    throw new Error('No valid JSON found in response');
  } catch (error) {
    console.error('[VCSentiment] JSON extraction error:', error);
    throw new Error('Failed to extract valid JSON from response');
  }
}

function sanitizeJSON(data: any): any {
  if (Array.isArray(data)) {
    return data.map(item => sanitizeJSON(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    const result: any = {};
    for (const [key, value] of Object.entries(data)) {
      // Convert null/undefined to empty string for string fields
      if (value === null || value === undefined) {
        if (Array.isArray(data[key])) {
          result[key] = [];
        } else if (typeof data[key] === 'number') {
          result[key] = 0;
        } else if (typeof data[key] === 'string') {
          result[key] = '';
        } else if (typeof data[key] === 'object') {
          result[key] = {};
        } else {
          result[key] = '';
        }
      } else {
        result[key] = sanitizeJSON(value);
      }
    }
    return result;
  }
  
  return data;
}

export async function generateVCSentiment(input: UserInput): Promise<VCSentimentData> {
  console.log('[VCSentiment] Starting generation with input:', JSON.stringify(input, null, 2));

  // Return pending state immediately
  const pendingState: VCSentimentData = {
    status: 'pending',
    sectionId: 'vcSentiment',
    createdAt: new Date(),
    updatedAt: new Date(),
    overview: {
      score: 0,
      confidence: 0,
      summary: "Analyzing investment potential...",
      verdict: "Analysis in progress"
    },
    investmentAttractiveness: {
      score: 0,
      confidence: 0,
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: []
    },
    marketActivity: {
      investmentVolume: {
        total: "Analyzing...",
        timeframe: "Analyzing...",
        trend: "Analyzing...",
        growth: "Analyzing...",
        analysis: "Analyzing market activity..."
      },
      notableTransactions: [],
      comparableExits: []
    },
    marketTrends: {
      overview: "Analyzing market trends...",
      trends: [],
      investorSentiment: {
        overall: "Analyzing...",
        keyFactors: [],
        concerns: [],
        outlook: "Analyzing investor sentiment..."
      }
    },
    fundingStrategy: {
      recommendedRound: {
        type: "Analyzing...",
        targetAmount: "Analyzing...",
        timing: "Analyzing...",
        valuation: {
          range: "Analyzing...",
          basis: []
        }
      },
      useOfFunds: [],
      targetInvestors: [],
      milestones: []
    }
  };

  try {
    // Return pending state immediately
    await Promise.resolve(pendingState);

    const prompt = `You are a senior venture capital market analyst expert. Your task is to analyze a business and provide a VC investment analysis report in JSON format.

IMPORTANT: You must ONLY return a valid JSON object. Do not include any other text, markdown, or explanations outside the JSON.

Business Information:
${JSON.stringify(input, null, 2)}

Requirements:
1. All scores must be between 0-100
2. All arrays must contain at least one item
3. All text fields must be descriptive (minimum 50 characters)
4. Dates must be in YYYY-MM format
5. Monetary values must include currency symbol ($)
6. Percentages must be in X% format
7. All fields in the structure are required
8. No placeholder or generic responses allowed

Return a JSON object with this exact structure (replace example values with your analysis):
{
  "overview": {
    "score": 85,
    "confidence": 90,
    "summary": "Comprehensive analysis of the business potential, market opportunity, and investment thesis. Include specific market size, growth rates, and competitive advantages.",
    "verdict": "Clear investment recommendation with specific reasons and potential returns"
  },
  "investmentAttractiveness": {
    "score": 85,
    "confidence": 90,
    "strengths": [
      "Detailed strength with market evidence and metrics",
      "Another specific strength with supporting data"
    ],
    "weaknesses": [
      "Specific weakness with potential mitigation strategies",
      "Another weakness with market context"
    ],
    "opportunities": [
      "Concrete market opportunity with size and timing",
      "Another specific opportunity with growth potential"
    ],
    "threats": [
      "Specific market or competitive threat with likelihood",
      "Another threat with potential impact assessment"
    ]
  },
  "marketActivity": {
    "investmentVolume": {
      "total": "$500M",
      "timeframe": "Last 12 months",
      "trend": "Increasing 25% annually",
      "growth": "25% YoY",
      "analysis": "Detailed analysis of investment trends, major players, and market dynamics in this sector over the past year and future outlook"
    },
    "notableTransactions": [
      {
        "date": "2024-03",
        "company": "Specific Company Name",
        "round": "Series B",
        "amount": "$50M",
        "investors": ["Lead Investor Name", "Other Investor Name"],
        "valuation": "$200M"
      }
    ],
    "comparableExits": [
      {
        "company": "Specific Company Name",
        "date": "2024-02",
        "type": "Acquisition",
        "value": "$500M",
        "details": "Detailed exit information including buyer, strategic rationale, and market impact"
      }
    ]
  },
  "marketTrends": {
    "overview": "Comprehensive analysis of current market dynamics, growth drivers, and future outlook. Include specific trends, market size, and growth rates.",
    "trends": [
      {
        "name": "Specific Market Trend",
        "impact": "Detailed analysis of how this trend affects the business and market opportunity",
        "timeline": "Next 12-18 months"
      }
    ],
    "investorSentiment": {
      "overall": "Specific assessment of current investor sentiment with supporting evidence",
      "keyFactors": [
        "Specific factor driving investor interest with evidence",
        "Another key factor with market context"
      ],
      "concerns": [
        "Specific investor concern with potential mitigation",
        "Another concern with market context"
      ],
      "outlook": "Detailed analysis of future investor sentiment trends and potential changes in the market"
    }
  },
  "fundingStrategy": {
    "recommendedRound": {
      "type": "Series A",
      "targetAmount": "$15M",
      "timing": "Q3 2024",
      "valuation": {
        "range": "$60M - $75M",
        "basis": [
          "Specific valuation multiple or metric with market comparables",
          "Another valuation factor with supporting data"
        ]
      }
    },
    "useOfFunds": [
      {
        "category": "Specific Use Category",
        "allocation": "40%",
        "details": "Detailed explanation of how funds will be used and expected impact on growth"
      }
    ],
    "targetInvestors": [
      {
        "type": "Specific Investor Type",
        "focus": ["Relevant Focus Area", "Another Focus Area"],
        "examples": ["Specific Fund Name", "Another Fund Name"]
      }
    ],
    "milestones": [
      {
        "milestone": "Specific Growth or Development Milestone",
        "timeline": "Q4 2024",
        "impact": "Detailed description of milestone impact on business growth and valuation"
      }
    ]
  }
}`;

    console.log('[VCSentiment] Sending prompt:', prompt);

    // Make the API call with retries
    const response = await retryWithBackoff(async () => {
      try {
        const result = await queryPerplexity(prompt);
        if (!result?.choices?.[0]?.message?.content) {
          throw new Error('Invalid API response structure');
        }
        return result;
      } catch (error) {
        console.error('[VCSentiment] API call error:', error);
        throw error;
      }
    });

    console.log('[VCSentiment] Raw API response:', JSON.stringify(response, null, 2));

    let parsedData: VCSentimentResponse;
    try {
      const content = response.choices[0].message.content;
      console.log('[VCSentiment] Raw content:', content);

      // Extract and parse JSON
      parsedData = extractJSON(content);
      console.log('[VCSentiment] Extracted JSON:', JSON.stringify(parsedData, null, 2));

      // Validate the data structure
      if (!validateVCSentimentResponse(parsedData)) {
        console.error('[VCSentiment] Validation failed for data:', JSON.stringify(parsedData, null, 2));
        throw new Error('Invalid data structure received from API');
      }

      // Transform and return the data
      const result = transformVCSentimentData(parsedData);
      console.log('[VCSentiment] Final transformed result:', JSON.stringify(result, null, 2));
      return result;

    } catch (error) {
      console.error('[VCSentiment] Processing error:', error);
      throw error;
    }
  } catch (error) {
    console.error('[VCSentiment] Generation error:', error);
    return {
      ...pendingState,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Failed to generate VC sentiment analysis',
      sectionId: 'vcSentiment'
    };
  }
} 