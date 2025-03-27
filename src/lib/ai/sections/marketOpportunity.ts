import { MarketResearch, AnalysisInput } from '../../../lib/models/analysis';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MARKET_OPPORTUNITY_PROMPT = `You are a market research expert. Analyze the following startup idea and provide a detailed market opportunity assessment.

Startup Details:
Industry: {industry}
Stage: {currentStage}
Pricing Model: {pricingModel}
Team: {teamComposition}
Description: {description}

Please provide a comprehensive market opportunity analysis in JSON format with the following structure:
{
  "marketSize": {
    "total": "Total market size in dollars",
    "addressable": "Serviceable addressable market size in dollars",
    "obtainable": "Serviceable obtainable market size in dollars",
    "growth": "Annual market growth rate as a percentage"
  },
  "demographics": {
    "primarySegments": ["Array of primary target segments"],
    "segmentDetails": [
      {
        "name": "Segment name",
        "characteristics": ["Array of segment characteristics"],
        "preferences": ["Array of segment preferences"],
        "painPoints": ["Array of segment pain points"],
        "acquisitionChannels": ["Array of acquisition channels"]
      }
    ]
  },
  "trends": [
    {
      "name": "Trend name",
      "description": "Trend description",
      "impact": "Impact on the business",
      "timeframe": "Expected timeframe",
      "source": "Source of the trend data",
      "opportunities": ["Array of opportunities"],
      "threats": ["Array of threats"]
    }
  ],
  "vcActivity": {
    "activeVCs": 0,
    "totalInvestment": "Total VC investment in the space",
    "averageDealSize": "Average deal size",
    "notableDeals": [
      {
        "investor": "Investor name",
        "company": "Company name",
        "amount": "Investment amount",
        "date": "Investment date"
      }
    ]
  },
  "competitors": [
    {
      "name": "Competitor name",
      "type": "Competitor type",
      "marketShare": "Market share percentage",
      "strengths": ["Array of strengths"],
      "weaknesses": ["Array of weaknesses"],
      "strategy": "Competitive strategy",
      "pricing": "Pricing strategy",
      "differentiators": ["Array of differentiators"]
    }
  ],
  "regulations": [
    {
      "type": "Regulation type",
      "description": "Regulation description",
      "impact": "Impact on the business",
      "compliance": "Compliance requirements",
      "timeline": "Implementation timeline",
      "cost": "Compliance cost",
      "jurisdiction": "Applicable jurisdiction"
    }
  ],
  "marketDynamics": {
    "entryBarriers": [
      {
        "barrier": "Entry barrier",
        "impact": "Impact on the business",
        "mitigation": "Mitigation strategy"
      }
    ],
    "supplierPower": "Analysis of supplier power",
    "buyerPower": "Analysis of buyer power",
    "substitutes": ["Array of substitute products/services"],
    "industryRivalry": "Analysis of industry rivalry"
  }
}

Ensure all values are realistic and based on current market data.`;

function generateMarketOpportunityPrompt(input: AnalysisInput): string {
  return MARKET_OPPORTUNITY_PROMPT
    .replace('{industry}', input.industry)
    .replace('{currentStage}', input.currentStage)
    .replace('{pricingModel}', input.pricingModel)
    .replace('{teamComposition}', input.teamComposition)
    .replace('{description}', input.description);
}

export async function generateMarketOpportunity(input: AnalysisInput): Promise<MarketResearch> {
  try {
    const prompt = generateMarketOpportunityPrompt(input);

    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0].type === 'text' 
      ? response.content[0].text 
      : JSON.stringify(response.content[0]);

    // Try to extract JSON if the response contains surrounding text
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsedJson = JSON.parse(jsonMatch[0]);
        return {
          ...parsedJson,
        };
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
      }
    }

    // Retry with a simplified prompt
    const retryResponse = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: 'Please provide a valid JSON object with the following structure:\n' +
            JSON.stringify({
              marketSize: {
                total: '',
                addressable: '',
                obtainable: '',
                growth: ''
              },
              demographics: {
                primarySegments: [],
                segmentDetails: []
              },
              trends: [],
              vcActivity: {
                activeVCs: 0,
                totalInvestment: '',
                averageDealSize: '',
                notableDeals: []
              },
              competitors: [],
              regulations: [],
              marketDynamics: {
                entryBarriers: [],
                supplierPower: '',
                buyerPower: '',
                substitutes: [],
                industryRivalry: ''
              }
            }, null, 2)
        }
      ],
    });

    const retryContent = retryResponse.content[0].type === 'text'
      ? retryResponse.content[0].text
      : JSON.stringify(retryResponse.content[0]);

    return JSON.parse(retryContent);

  } catch (error) {
    console.error('Error generating market opportunity:', error);
    throw error;
  }
} 