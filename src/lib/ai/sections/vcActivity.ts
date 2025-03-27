import { MarketResearch, AnalysisInput } from '../../../lib/models/analysis';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const VC_ACTIVITY_PROMPT = `You are a venture capital market analyst. Analyze the VC activity and investment landscape for the following startup idea.

Startup Details:
Industry: {industry}
Stage: {currentStage}
Pricing Model: {pricingModel}
Team: {teamComposition}
Description: {description}

Please provide a comprehensive VC activity analysis in JSON format with the following structure:
{
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
  }
}

Ensure all values are realistic and based on current market data.`;

function generateVCActivityPrompt(input: AnalysisInput): string {
  return VC_ACTIVITY_PROMPT
    .replace('{industry}', input.industry)
    .replace('{currentStage}', input.currentStage)
    .replace('{pricingModel}', input.pricingModel)
    .replace('{teamComposition}', input.teamComposition)
    .replace('{description}', input.description);
}

export async function generateVCActivity(input: AnalysisInput): Promise<MarketResearch['vcActivity']> {
  try {
    const prompt = generateVCActivityPrompt(input);

    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 2000,
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
        return parsedJson.vcActivity;
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
      }
    }

    // Retry with a simplified prompt
    const retryResponse = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: 'Please provide a valid JSON object with the following structure:\n' +
            JSON.stringify({
              vcActivity: {
                activeVCs: 0,
                totalInvestment: '',
                averageDealSize: '',
                notableDeals: []
              }
            }, null, 2)
        }
      ],
    });

    const retryContent = retryResponse.content[0].type === 'text'
      ? retryResponse.content[0].text
      : JSON.stringify(retryResponse.content[0]);

    const parsedJson = JSON.parse(retryContent);
    return parsedJson.vcActivity;

  } catch (error) {
    console.error('Error generating VC activity:', error);
    throw error;
  }
} 