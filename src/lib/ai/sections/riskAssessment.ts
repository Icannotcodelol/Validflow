import { DetailedAnalysis, AnalysisInput, RiskAssessment } from '../../../lib/models/analysis';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const RISK_ASSESSMENT_PROMPT = `You are a risk assessment expert. Analyze the following startup idea and provide a detailed risk assessment.

Startup Details:
Industry: {industry}
Stage: {currentStage}
Pricing Model: {pricingModel}
Team: {teamComposition}
Description: {description}

Please provide a comprehensive risk assessment in JSON format with the following structure:
{
  "riskAssessment": {
    "marketRisks": [
      {
        "risk": "Description of the market risk",
        "likelihood": "High/Medium/Low",
        "impact": "High/Medium/Low",
        "mitigation": "Mitigation strategy"
      }
    ],
    "operationalRisks": [
      {
        "risk": "Description of the operational risk",
        "likelihood": "High/Medium/Low",
        "impact": "High/Medium/Low",
        "mitigation": "Mitigation strategy"
      }
    ],
    "financialRisks": [
      {
        "risk": "Description of the financial risk",
        "likelihood": "High/Medium/Low",
        "impact": "High/Medium/Low",
        "mitigation": "Mitigation strategy"
      }
    ],
    "riskScore": 0
  }
}

Ensure all risks are realistic and based on industry data. The riskScore should be between 0 and 100, where 0 is extremely risky and 100 is very safe.`;

function generateRiskAssessmentPrompt(input: AnalysisInput): string {
  return RISK_ASSESSMENT_PROMPT
    .replace('{industry}', input.industry)
    .replace('{currentStage}', input.currentStage)
    .replace('{pricingModel}', input.pricingModel)
    .replace('{teamComposition}', input.teamComposition)
    .replace('{description}', input.description);
}

function transformRiskAssessmentData(data: DetailedAnalysis['riskAssessment']): RiskAssessment {
  return {
    status: 'completed',
    error: undefined,
    riskScore: data.riskScore,
    marketRisks: data.marketRisks.map(risk => ({
      name: risk.risk,
      description: risk.risk,
      likelihood: risk.likelihood,
      impact: risk.impact,
      mitigationStrategies: [risk.mitigation]
    })),
    operationalRisks: data.operationalRisks.map(risk => ({
      name: risk.risk,
      description: risk.risk,
      likelihood: risk.likelihood,
      impact: risk.impact,
      mitigationStrategies: [risk.mitigation]
    })),
    financialRisks: data.financialRisks.map(risk => ({
      name: risk.risk,
      description: risk.risk,
      likelihood: risk.likelihood,
      impact: risk.impact,
      mitigationStrategies: [risk.mitigation]
    }))
  };
}

export async function generateRiskAssessment(input: AnalysisInput): Promise<RiskAssessment> {
  try {
    const prompt = generateRiskAssessmentPrompt(input);

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
        return transformRiskAssessmentData(parsedJson.riskAssessment);
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
              riskAssessment: {
                marketRisks: [],
                operationalRisks: [],
                financialRisks: [],
                riskScore: 0
              }
            }, null, 2)
        }
      ],
    });

    const retryContent = retryResponse.content[0].type === 'text'
      ? retryResponse.content[0].text
      : JSON.stringify(retryResponse.content[0]);

    const parsedJson = JSON.parse(retryContent);
    return transformRiskAssessmentData(parsedJson.riskAssessment);

  } catch (error) {
    console.error('Error generating risk assessment:', error);
    throw error;
  }
} 