import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function analyzeIdea(
  idea: string,
  marketResearch: string,
  formData: any
) {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: `You are a senior business strategy consultant tasked with providing a comprehensive analysis of a business idea based on market research.

Input:
Business Idea: ${idea}
Market Research: ${marketResearch}
Form Data:
- Industry: ${formData.industry}
- Sub-industry: ${formData.subIndustry}
- Target Customers: ${formData.targetCustomers}
- Pricing Model: ${formData.pricingModel}
- Current Stage: ${formData.currentStage}
- Team Composition: ${formData.teamComposition}
- Additional Info: ${formData.additionalInfo}

Required Output Structure:
{
  "executiveSummary": {
    "title": "Clear, complete business name and value proposition",
    "verdict": "Highly Promising/Promising/Needs Work/High Risk",
    "score": "0-100 score based on comprehensive analysis",
    "summary": "3-4 sentence overview of key findings",
    "keyFindings": [{
      "type": "strength/warning/weakness",
      "text": "Clear, actionable finding"
    }]
  },
  "detailedAnalysis": {
    "valueProposition": {
      "uniqueness": "Differentiation factors",
      "sustainability": "Long-term advantages",
      "scalability": "Growth potential"
    },
    "marketFit": {
      "needAlignment": "How well it addresses market needs",
      "timingAnalysis": "Market readiness assessment",
      "competitiveAdvantage": "Sustainable advantages"
    },
    "financialAnalysis": {
      "revenueStreams": ["Detailed revenue sources"],
      "costStructure": {
        "fixed": ["Fixed costs"],
        "variable": ["Variable costs"],
        "unitEconomics": "Per-customer economics"
      },
      "projections": {
        "year1": "First year projections",
        "year3": "Third year projections",
        "breakeven": "Breakeven analysis"
      }
    },
    "riskAssessment": {
      "marketRisks": [{
        "risk": "Risk description",
        "likelihood": "High/Medium/Low",
        "impact": "Potential impact",
        "mitigation": "Mitigation strategy"
      }],
      "operationalRisks": [Same structure],
      "financialRisks": [Same structure]
    },
    "implementationPlan": {
      "phases": [{
        "name": "Phase name",
        "duration": "Timeline",
        "objectives": ["Key objectives"],
        "resources": ["Required resources"],
        "milestones": ["Key milestones"]
      }],
      "criticalPath": ["Critical dependencies"],
      "keyMetrics": ["Success metrics"]
    }
  }
}

Analysis Requirements:
1. Base all conclusions on provided market research
2. Include specific, actionable recommendations
3. Quantify impacts where possible
4. Consider industry-specific factors
5. Provide evidence-based scoring
6. Ensure all text is professional and free of emojis/special characters
7. Make recommendations specific and actionable
8. Include relevant metrics and KPIs
9. Consider regulatory and compliance factors
10. Address scalability and growth potential

Return your analysis in valid JSON format exactly matching the structure above.`,
        },
      ],
    });

    if (response.content[0].type === 'text') {
      return response.content[0].text;
    }
    throw new Error('Unexpected response type from Anthropic API');
  } catch (error) {
    console.error('Error in Anthropic API:', error);
    throw error;
  }
} 