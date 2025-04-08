import { Orchestrator } from './orchestrator';
import { AnalysisFormData } from '@/types/analysis';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

async function callPerplexityAPI(prompt: string) {
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      console.error(`Perplexity API Error Status: ${response.status}`);
      let errorBody = '[Could not read error body]';
      try {
        errorBody = await response.text();
        console.error('Perplexity API error body:', errorBody);
      } catch (e) {
        console.error('Failed to read Perplexity error body:', e);
      }
      throw new Error(`Perplexity API error: ${response.statusText} (Status: ${response.status})`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Perplexity API:', error);
    throw error;
  }
}

export async function processAnalysis(
  analysisId: string,
  formData: AnalysisFormData,
  orchestrator: Orchestrator
): Promise<void> {
  console.log(`[processAnalysis] Starting background processing for analysis ID: ${analysisId}`);
  console.log(`[processAnalysis] Received form data:`, formData);
  try {
    console.log(`[processAnalysis] Updating status to 'processing' for ID: ${analysisId}`);
    // Update status to processing
    await orchestrator.updateAnalysisStatus(analysisId, 'processing');
    console.log(`[processAnalysis] Status updated to 'processing' for ID: ${analysisId}`);

    // Process each section sequentially
    for (const section of ANALYSIS_SECTIONS) {
      try {
        console.log(`Processing section: ${section}`);
        
        // Mark section as pending
        await orchestrator.updateAnalysisSection(analysisId, section, null, 'pending');

        // Generate section content
        const sectionData = await generateSectionContent(section, formData);

        // Update section with generated content
        await orchestrator.updateAnalysisSection(analysisId, section, sectionData, 'completed');
        
        console.log(`Completed section: ${section}`);
      } catch (error) {
        console.error(`Error processing section ${section}:`, error);
        await orchestrator.updateAnalysisSection(analysisId, section, null, 'failed');
      }
    }

    // Update final status
    await orchestrator.updateAnalysisStatus(analysisId, 'completed');
  } catch (error) {
    console.error('Error in processAnalysis:', error);
    await orchestrator.updateAnalysisStatus(analysisId, 'failed');
    throw error;
  }
}

export const ANALYSIS_SECTIONS = [
  'executiveSummary',
  'marketSizeGrowth',
  'targetUsers',
  'competition',
  'unitEconomics',
  'marketingChannels',
  'goToMarketPlan',
  'vcSentiment',
  'criticalThoughtQuestions',
  'reportSummary',
] as const;

async function generateSectionContent(
  section: typeof ANALYSIS_SECTIONS[number],
  formData: AnalysisFormData
): Promise<any> {
  const prompt = generatePromptForSection(section, formData);
  
  try {
    let response: string;
    
    // Use different models for different sections
    switch (section) {
      case 'executiveSummary':
      case 'criticalThoughtQuestions':
        // Use Claude for strategic analysis
        const claudeResponse = await anthropic.messages.create({
          model: 'claude-3-opus-20240229',
          max_tokens: 4000,
          messages: [{ role: 'user', content: prompt }],
        });
        if (claudeResponse.content && claudeResponse.content.length > 0 && claudeResponse.content[0].type === 'text') {
          response = claudeResponse.content[0].text;
        } else {
          console.warn(`[processAnalysis] Unexpected content structure from Claude for section ${section}:`, claudeResponse.content);
          response = '';
        }
        break;

      case 'marketSizeGrowth':
      case 'competition':
      case 'unitEconomics':
      case 'vcSentiment':
        // Use Perplexity for market research and data analysis
        response = await callPerplexityAPI(prompt);
        break;

      default:
        // Use GPT-4 for general analysis
        console.log(`[processAnalysis] Calling OpenAI GPT-4 for section: ${section}`);
        const gpt4Response = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 4000
        });
        response = gpt4Response.choices[0].message.content || '';
        console.log(`[processAnalysis] Received response from OpenAI GPT-4 for section: ${section}`);
        break;
    }

    // Attempt to parse the response, extracting JSON even if wrapped
    let parsedData: any;
    let extractedJsonString: string | null = null;
    try {
      // 1. Check for markdown code block
      const markdownMatch = response.match(/```json\n?([\s\S]*?)\n?```/);
      if (markdownMatch && markdownMatch[1]) {
        extractedJsonString = markdownMatch[1].trim();
        console.log(`[processAnalysis] Extracted JSON from markdown for section: ${section}`);
      } else {
        // 2. If no markdown, find first { and last }
        const firstBrace = response.indexOf('{');
        const lastBrace = response.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
          extractedJsonString = response.substring(firstBrace, lastBrace + 1).trim();
          console.log(`[processAnalysis] Extracted JSON substring for section: ${section}`);
        } 
      }

      // 3. Attempt parsing if we extracted a potential JSON string
      if (extractedJsonString) {
        parsedData = JSON.parse(extractedJsonString);
        console.log(`[processAnalysis] Successfully parsed extracted JSON for section: ${section}`);
        
        // Check if the parsed data is an object with a single key matching the section name
        const keys = Object.keys(parsedData);
        if (keys.length === 1 && keys[0] === section && typeof parsedData[section] === 'object') {
          console.log(`[processAnalysis] Unwrapping data for section: ${section}`);
          parsedData = parsedData[section]; // Extract the inner object
        }

        if (section === 'executiveSummary') {
          // This log will now show the *potentially unwrapped* data structure
          console.log('[processAnalysis] Final executiveSummary Data Structure being returned:', JSON.stringify(parsedData, null, 2));
        }

      } else {
        // 4. If no JSON structure found/extracted, treat as error/raw
         console.log(`[processAnalysis] No JSON structure found/extracted for section: ${section}, storing raw.`);
         throw new Error("No valid JSON structure found in AI response."); // Force falling into catch block
      }

    } catch (parseError: any) {
      console.error(`[processAnalysis] Failed to parse JSON for section ${section}. Error:`, parseError.message);
      console.error(`[processAnalysis] Raw response for section ${section}:`, response);
      // Store the raw response with an error indicator if parsing fails
      parsedData = { error: 'Failed to parse AI response', content: response }; 
    }

    // Return the structured data DIRECTLY, without the extra section name wrapping
    return parsedData;
  } catch (error) {
    console.error(`Error generating content for ${section}:`, error);
    throw error;
  }
}

function generatePromptForSection(
  section: typeof ANALYSIS_SECTIONS[number],
  formData: AnalysisFormData
): string {
  // Strong directive added to the start of every prompt
  const jsonDirective = "IMPORTANT: Respond ONLY with a valid JSON object that adheres EXACTLY to the requested structure. Start your response immediately with '{' and end it with '}'. Do NOT include ```json markers, explanations, introductions, greetings, summaries, or any text whatsoever outside the JSON object itself.";
  
  const baseContext = `
    Analyze this business idea:
    Description: ${formData.description}
    Industry: ${formData.industry}
    Sub-Industry: ${formData.subIndustry}
    Target Customers: ${formData.targetCustomers}
    Pricing Model: ${formData.pricingModel}
    Current Stage: ${formData.currentStage}
    Team Composition: ${formData.teamComposition}
    ${formData.additionalInfo ? `Additional Info: ${formData.additionalInfo}` : ''}
  `.trim();

  const prompts: Record<typeof ANALYSIS_SECTIONS[number], string> = {
    executiveSummary: `${jsonDirective}

${baseContext}

Analyze the business idea and provide a structured analysis in the following EXACT JSON format:
{
  "title": "Brief title summarizing the business idea",
  "verdict": "positive" | "negative" | "neutral",
  "score": number between 0-100,
  "summary": "2-3 paragraph executive summary",
  "keyFindings": [
    {
      "type": "strength" | "weakness" | "opportunity" | "threat",
      "text": "detailed finding description"
    }
  ]
}

Ensure:
1. The verdict must be exactly one of: "positive", "negative", or "neutral"
2. The score must be a number between 0-100
3. Each keyFinding type must be exactly one of: "strength", "weakness", "opportunity", "threat"
4. Include 2-3 findings of each type
5. The summary should be comprehensive but concise

IMPORTANT: Return ONLY the JSON object, no other text.`,
    marketSizeGrowth: `${jsonDirective}

${baseContext}

Provide a detailed market size analysis in the following EXACT JSON format:
{
  "marketSize": {
    "total": "Detailed TAM analysis with numbers and sources",
    "addressable": "Detailed SAM analysis with focus regions and growth rates",
    "obtainable": "Detailed SOM analysis with realistic market capture estimates",
    "growth": "Key market trends and growth drivers",
    "analysis": "Comprehensive market analysis",
    "projections": [
      {
        "year": "YYYY",
        "value": "Projected market value"
      }
    ]
  }
}

Ensure:
1. All market size numbers should be specific and include sources
2. Include at least 3 years of projections
3. Growth rates should be realistic and well-supported
4. Analysis should be data-driven and comprehensive

IMPORTANT: Return ONLY the JSON object, no other text.`,
    targetUsers: `${jsonDirective}

${baseContext}

Create detailed user personas and analysis in the following EXACT JSON format:
{
  "primaryUserPersonas": [
    {
      "name": "Persona name",
      "description": "Detailed persona description",
      "painPoints": ["List of specific pain points"],
      "needs": ["List of specific needs"],
      "behaviors": ["List of key behaviors"]
    }
  ],
  "userSegments": [
    {
      "segment": "Segment name",
      "size": "Market size of segment",
      "characteristics": ["Key characteristics"]
    }
  ],
  "userAcquisitionStrategy": "Detailed acquisition strategy",
  "userRetentionStrategy": "Detailed retention strategy"
}

Ensure:
1. Include 2-3 detailed user personas
2. Cover 2-3 distinct user segments
3. Strategies should be specific and actionable
4. All data should be realistic and well-supported

IMPORTANT: Return ONLY the JSON object, no other text.`,
    competition: `${jsonDirective}

${baseContext}

Provide a comprehensive competitive analysis in the following EXACT JSON format:
{
  "directCompetitors": [
    {
      "name": "Competitor name",
      "description": "Detailed description",
      "strengths": ["List of strengths"],
      "weaknesses": ["List of weaknesses"],
      "marketShare": "Estimated market share",
      "features": {
        "featureName": {
          "supported": true/false,
          "notes": "Additional notes"
        }
      },
      "pricing": {
        "model": "Pricing model description",
        "startingPrice": "Starting price",
        "enterprise": "Enterprise pricing info"
      },
      "marketPosition": {
        "pricingTier": "premium" | "mid-market" | "economy",
        "featureTier": "basic" | "advanced" | "enterprise",
        "targetSegment": ["Target segments"]
      }
    }
  ],
  "indirectCompetitors": [
    {
      "name": "Competitor name",
      "description": "Detailed description",
      "threatLevel": "High" | "Medium" | "Low",
      "overlapAreas": ["Areas of overlap"]
    }
  ],
  "competitiveAdvantages": ["List of advantages"],
  "marketGaps": ["List of market gaps"],
  "featureComparison": {
    "features": ["List of features"],
    "comparisonMatrix": {
      "featureName": {
        "competitorName": true/false
      }
    }
  },
  "marketPositioning": {
    "axisX": {
      "label": "X-axis label",
      "min": "Minimum value",
      "max": "Maximum value"
    },
    "axisY": {
      "label": "Y-axis label",
      "min": "Minimum value",
      "max": "Maximum value"
    },
    "positions": [
      {
        "competitor": "Competitor name",
        "x": number between 0-100,
        "y": number between 0-100
      }
    ]
  }
}

Ensure:
1. Include 3-5 direct competitors
2. Include 2-3 indirect competitors
3. Feature comparison should be comprehensive
4. Market positioning should be data-driven
5. All data should be realistic and well-supported

IMPORTANT: Return ONLY the JSON object, no other text.`,
    unitEconomics: `${jsonDirective}

${baseContext}

Analyze the unit economics in the following EXACT JSON format:
{
  "pricing": {
    "model": "Pricing model description",
    "strategy": "Pricing strategy",
    "tiers": [
      {
        "name": "Tier name",
        "price": "Price point",
        "features": ["List of features"]
      }
    ]
  },
  "costs": {
    "fixed": [
      {
        "name": "Cost name",
        "amount": "Cost amount",
        "frequency": "Monthly/Yearly"
      }
    ],
    "variable": [
      {
        "name": "Cost name",
        "amount": "Cost amount",
        "unit": "Per unit"
      }
    ]
  },
  "metrics": {
    "cac": "Customer Acquisition Cost",
    "ltv": "Customer Lifetime Value",
    "margin": "Profit margin",
    "paybackPeriod": "Payback period",
    "breakEvenPoint": "Break-even point"
  },
  "projections": [
    {
      "period": "Period name",
      "revenue": "Projected revenue",
      "costs": "Projected costs",
      "profit": "Projected profit"
    }
  ]
}

Ensure:
1. Include 2-3 pricing tiers
2. List all major fixed and variable costs
3. Include at least 3 periods of projections
4. All numbers should be realistic and well-supported
5. Metrics should be calculated based on provided data

IMPORTANT: Return ONLY the JSON object, no other text.`,
    marketingChannels: `${jsonDirective}

${baseContext}

Recommend and analyze marketing channels in the following EXACT JSON format:
{
  "channels": [
    {
      "name": "Channel name",
      "description": "Channel description",
      "type": "primary" | "secondary" | "experimental",
      "metrics": {
        "reach": "Estimated reach",
        "cost": "Estimated cost",
        "roi": "Expected ROI",
        "conversionRate": "Expected conversion rate"
      },
      "strategy": "Channel strategy",
      "timeline": "Implementation timeline",
      "budget": "Budget allocation",
      "kpis": ["List of KPIs"]
    }
  ],
  "budget": {
    "total": "Total budget",
    "breakdown": [
      {
        "category": "Category name",
        "amount": "Budget amount",
        "percentage": "Percentage of total"
      }
    ],
    "timeline": "Budget timeline"
  },
  "recommendations": ["List of recommendations"],
  "analysis": "Comprehensive channel analysis"
}

Ensure:
1. Include 3-5 marketing channels
2. Mix of primary, secondary, and experimental channels
3. Budget breakdown should total 100%
4. All metrics should be realistic and well-supported
5. Recommendations should be specific and actionable

IMPORTANT: Return ONLY the JSON object, no other text.`,
    goToMarketPlan: `${jsonDirective}

${baseContext}

Develop a comprehensive go-to-market strategy in the following EXACT JSON format:
{
  "launchStrategy": {
    "phases": [
      {
        "phase": "Phase name",
        "timeline": "Phase timeline",
        "activities": ["List of activities"],
        "metrics": ["List of metrics"]
      }
    ]
  },
  "keyPartnerships": [
    {
      "partner": "Partner name",
      "type": "Partnership type",
      "value": "Value proposition"
    }
  ],
  "resourceRequirements": {
    "team": ["List of team requirements"],
    "budget": "Budget requirements",
    "technology": ["List of technology requirements"]
  }
}

Ensure:
1. Include 3-4 launch phases
2. Include 2-3 key partnerships
3. Resource requirements should be comprehensive
4. All timelines should be realistic
5. Metrics should be specific and measurable

IMPORTANT: Return ONLY the JSON object, no other text.`,
    criticalThoughtQuestions: `${jsonDirective}

${baseContext}

Analyze the business idea and provide the 5 most critical questions in the following EXACT JSON format:
{
  "questions": [
    {
      "category": "Market Demand",
      "question": "What evidence supports the market need?",
      "analysis": "Detailed analysis of the question",
      "priority": "high" | "medium" | "low",
      "implications": ["Implication 1", "Implication 2"],
      "recommendations": ["Recommendation 1", "Recommendation 2"]
    }
  ],
  "riskAssessment": {
    "highPriority": ["Risk 1", "Risk 2"],
    "mediumPriority": ["Risk 3", "Risk 4"],
    "lowPriority": ["Risk 5", "Risk 6"]
  },
  "actionItems": [
    {
      "item": "Action to take",
      "priority": "high" | "medium" | "low",
      "timeline": "Q2 2024",
      "owner": "Product Team"
    }
  ]
}

Analyze these 5 critical areas:
1. Market Demand - Is there sufficient evidence of market demand and growth potential?
2. User Experience - How will the solution deliver unique value to users?
3. Competition - What are the key differentiators from existing solutions?
4. Business Model - How sustainable and scalable is the revenue model?
5. Technical Feasibility - What are the main technical challenges and risks?

For each question:
- Provide detailed analysis backed by data and industry insights
- List 2-3 key implications for the business
- Give 2-3 actionable recommendations
- Assign appropriate priority level (high/medium/low)

Risk Assessment should include:
- High Priority: Immediate risks that could derail the business
- Medium Priority: Significant challenges that need addressing
- Low Priority: Potential issues to monitor

Action Items should:
- Be specific and actionable
- Include clear timelines
- Assign ownership to relevant teams/roles
- Focus on addressing the highest priority risks first

Ensure:
1. All priorities must be exactly "high", "medium", or "low"
2. Each question must have detailed analysis
3. Implications should be specific and relevant
4. Recommendations should be practical and actionable
5. Risk assessment should be comprehensive
6. Action items should have clear ownership and timelines

IMPORTANT: Return ONLY the JSON object, no other text.`,
    vcSentiment: `${jsonDirective}

${baseContext}

Analyze potential investor sentiment and market context in the following EXACT JSON format:
{
  "overview": {
    "score": number between 0-100, // Overall sentiment score for this section
    "confidence": number between 0-100, // Confidence in the assessment
    "summary": "Brief summary of the VC sentiment analysis",
    "verdict": "Investment verdict (e.g., 'Highly Attractive', 'Promising', 'Needs Validation')"
  },
  "investmentAttractiveness": {
    "score": number between 0-100, // Score specifically for attractiveness factors
    "confidence": number between 0-100, // Confidence in this sub-score
    "strengths": ["List of key strengths that would attract investors"],
    "weaknesses": ["List of key weaknesses that might concern investors"],
    "opportunities": ["List of growth and expansion opportunities relevant to VCs"],
    "threats": ["List of market and business risks relevant to VCs"]
  },
  "marketActivity": {
     "investmentVolume": {
       "total": "Total investment volume in the relevant sector/timeframe (e.g., '$9.5B')",
       "timeframe": "Timeframe for the volume (e.g., 'Last 12 months')",
       "trend": "Trend direction (e.g., 'Increasing', 'Stable', 'Decreasing')",
       "growth": "Growth rate if available (e.g., '20% YoY')",
       "analysis": "Brief analysis of the investment volume"
     },
     "notableTransactions": [
       {
         "date": "YYYY-MM", // Month is sufficient
         "company": "Company name",
         "round": "Funding round (e.g., 'Series A')",
         "amount": "Amount in $M format (e.g., '$10M')",
         "valuation": "Valuation if known (e.g., '$50M', 'N/A')",
         "investors": ["List 1-3 key investors"]
       }
     ],
     "comparableExits": [
       {
          "company": "Company name",
          "date": "YYYY-MM",
          "type": "Exit type (e.g., 'IPO', 'Acquisition')",
          "value": "Exit value or description (e.g., '$500M', 'Undisclosed', 'Successful')",
          "details": "Brief details about the exit"
       }
     ]
  },
  "marketTrends": { // <-- Corrected Structure
    "overview": "General overview of current market trends relevant to this investment.",
    "trends": [ // <-- Array of trend objects
      {
        "name": "Trend name (e.g., 'AI-driven personalization')", // <-- Field name "name"
        "impact": "High" | "Medium" | "Low", // <-- Impact level
        "timeline": "Immediate" | "Mid-term" | "Long-term" // <-- Timeline
      }
    ],
    "investorSentiment": { // <-- Investor Sentiment Object
      "overall": "Highly Positive" | "Positive" | "Neutral" | "Negative" | "Highly Negative",
      "keyFactors": ["List of factors driving positive sentiment"],
      "concerns": ["List of factors driving negative sentiment or concerns"],
      "outlook": "Brief outlook on future investor sentiment in this space"
    }
  },
   "fundingStrategy": { // Optional: Include if analysis warrants it
     "recommendedRound": {
       "type": "Recommended funding round (e.g., 'Seed', 'Series A')",
       "targetAmount": "Target amount (e.g., '$5M - $7M')",
       "timing": "Recommended timing (e.g., 'Q4 2024')",
       "valuation": {
         "range": "Estimated pre-money valuation range (e.g., '$20M - $25M')",
         "basis": ["Basis for valuation (e.g., 'Comparables', 'Traction')"]
       }
     },
     "useOfFunds": [
       {
         "category": "Category (e.g., 'Product Development')",
         "allocation": "Percentage (e.g., '40%')",
         "details": "Brief details on fund usage"
       }
     ],
     "targetInvestors": [
       {
         "type": "Investor type (e.g., 'Industry-Specific VCs')",
         "focus": ["Areas of focus (e.g., 'Fintech', 'AI')"],
         "examples": ["Example firm names (e.g., 'Sequoia', 'a16z')"]
       }
     ],
      "milestones": [
        {
          "milestone": "Key milestone post-funding",
          "timeline": "Timeline to achieve (e.g., '6 months')",
          "impact": "Impact of achieving milestone"
        }
      ]
   }
}

Ensure:
1. All requested sections and fields are included.
2. Scores and confidence levels are numbers between 0-100.
3. Provide 3-4 points each for strengths, weaknesses, opportunities, threats.
4. Include 2-3 notable transactions and comparable exits if relevant data is found.
5. Include 2-3 key market trends.
6. Investor sentiment 'overall' and trend 'impact'/'timeline' use the specified allowed values.
7. Funding strategy details should be realistic for the business stage.
8. Monetary values should be clear (e.g., "$10M"). Dates should be YYYY-MM.

IMPORTANT: Return ONLY the JSON object, no other text.`,
    reportSummary: `${jsonDirective}

${baseContext}

Provide a final summary in the following EXACT JSON format:
{
  "summary": "Comprehensive summary of all analyses",
  "keyFindings": ["List of key findings"],
  "recommendations": [
    {
      "category": "Category name",
      "items": ["List of recommendations"],
      "priority": "high" | "medium" | "low"
    }
  ],
  "nextSteps": [
    {
      "action": "Action item",
      "timeline": "Implementation timeline",
      "resources": ["List of required resources"]
    }
  ]
}

Ensure:
1. Summary should be comprehensive but concise
2. Include 5-7 key findings
3. Recommendations should be categorized and prioritized
4. Next steps should be specific and actionable
5. All timelines should be realistic

IMPORTANT: Return ONLY the JSON object, no other text.`
  };

  return prompts[section];
} 