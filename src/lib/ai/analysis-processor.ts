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

    // Process each section independently to ensure partial completion if interrupted
    const sectionPromises = ANALYSIS_SECTIONS.map(async (section) => {
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
    });

    // Wait for all sections to complete
    await Promise.allSettled(sectionPromises);

    // Check if any sections failed
    const analysis = await orchestrator.getAnalysis(analysisId);
    if (!analysis) {
      throw new Error('Analysis not found after processing sections');
    }

    const hasFailed = Object.entries(analysis.sections || {}).some(
      ([_, section]) => section?.status === 'failed'
    );

    // Update final status
    await orchestrator.updateAnalysisStatus(
      analysisId, 
      hasFailed ? 'failed' : 'completed'
    );
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
  'validationRoadmap',
  'keyPerformanceIndicators',
  'experimentDesign',
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
      case 'validationRoadmap':
      case 'experimentDesign':
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
      case 'keyPerformanceIndicators':
        // Use Perplexity for market research and data analysis
        response = await callPerplexityAPI(prompt);
        break;

      case 'targetUsers':
        // Add detailed logging for target users section
        console.log(`[processAnalysis] Starting Target Users analysis with prompt:`, prompt);
        const gpt4Response = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 4000
        });
        response = gpt4Response.choices[0].message.content || '';
        console.log(`[processAnalysis] Raw Target Users Response:`, response);
        break;

      default:
        // Use GPT-4 for general analysis
        console.log(`[processAnalysis] Calling OpenAI GPT-4 for section: ${section}`);
        const defaultGpt4Response = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 4000
        });
        response = defaultGpt4Response.choices[0].message.content || '';
        console.log(`[processAnalysis] Received response from OpenAI GPT-4 for section: ${section}`);
        break;
    }

    // Attempt to parse the response, extracting JSON even if wrapped
    let parsedData: any;
    let extractedJsonString: string | null = null;
    try {
      // Add specific logging for target users section
      if (section === 'targetUsers') {
        console.log('[processAnalysis] Target Users - Starting JSON extraction');
      }
      
      // 1. Check for markdown code block
      const markdownMatch = response.match(/```json\n?([\s\S]*?)\n?```/);
      if (markdownMatch && markdownMatch[1]) {
        extractedJsonString = markdownMatch[1].trim();
        if (section === 'targetUsers') {
          console.log('[processAnalysis] Target Users - Found JSON in markdown block:', extractedJsonString);
        }
      } else {
        // 2. If no markdown, find first { and last }
        const firstBrace = response.indexOf('{');
        const lastBrace = response.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
          extractedJsonString = response.substring(firstBrace, lastBrace + 1).trim();
          if (section === 'targetUsers') {
            console.log('[processAnalysis] Target Users - Extracted JSON substring:', extractedJsonString);
          }
        } 
      }

      // 3. Attempt parsing if we extracted a potential JSON string
      if (extractedJsonString) {
        parsedData = JSON.parse(extractedJsonString);
        if (section === 'targetUsers') {
          console.log('[processAnalysis] Target Users - Parsed data structure:', JSON.stringify(parsedData, null, 2));
        }
        
        // Check if the parsed data is an object with a single key matching the section name
        const keys = Object.keys(parsedData);
        if (keys.length === 1 && keys[0] === section && typeof parsedData[section] === 'object') {
          if (section === 'targetUsers') {
            console.log('[processAnalysis] Target Users - Unwrapping nested data structure');
          }
          parsedData = parsedData[section]; // Extract the inner object
        }

        if (section === 'targetUsers') {
          console.log('[processAnalysis] Target Users - Final data structure:', JSON.stringify(parsedData, null, 2));
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
2. The score must be a number between 0-100. DO NOT assign a score of exactly 85.
3. Each keyFinding type must be exactly one of: "strength", "weakness", "opportunity", "threat"
4. Include 2-3 findings of each type
5. The summary should be comprehensive but concise

IMPORTANT: Return ONLY the JSON object, no other text.`,
    marketSizeGrowth: `${jsonDirective}

${baseContext}

Provide a detailed market size analysis in the following EXACT JSON format. Ensure ALL specified top-level keys (\`totalAddressableMarket\`, \`serviceableAddressableMarket\`, \`serviceableObtainableMarket\`, \`growthRate\`, \`marketTrends\`, \`marketDrivers\`, \`marketChallenges\`) are present in the final JSON object, each containing its specified nested structure.

{\n  \"totalAddressableMarket\": {\n    \"size\": \"Detailed TAM analysis with numbers and sources (e.g., \'$13.82 billion by 2026\')\",\n    \"description\": \"Brief description of what the TAM represents\",\n    \"methodology\": \"Brief note on how the TAM was estimated (e.g., \'Source: MarketsandMarkets\')\"\n  },\n  \"serviceableAddressableMarket\": {\n    \"size\": \"Detailed SAM analysis with focus regions/segments and estimated value (e.g., \'$144 million annually\')\",\n    \"description\": \"Description of the segment of TAM reachable with your sales channels\",\n    \"limitations\": [\"List 1-3 key limitations or factors defining the SAM\"]\n  },\n  \"serviceableObtainableMarket\": {\n    \"size\": \"Detailed SOM analysis with realistic market capture estimates and timeframe (e.g., \'$720k-$1.44M in first year\')\",\n    \"description\": \"Description of the portion of SAM you can realistically capture\",\n    \"timeframe\": \"Timeframe for achieving the SOM estimate (e.g., \'within 3 years\')\",\n    \"assumptions\": [\"List 1-3 key assumptions made for the SOM calculation\"]\n  },\n  \"growthRate\": {\n    \"current\": \"Current market growth rate (e.g., \'12% CAGR\')\",\n    \"projected\": \"Projected future growth rate, if different from current\",\n    \"factors\": [\"List 2-4 key factors driving market growth (e.g., \'Increasing consumer demand for local produce\')\"]\n  },\n  \"marketTrends\": [\n    {\n      \"trend\": \"Name of a key market trend\",\n      \"description\": \"Brief description of the trend\",\n      \"impact\": \"How this trend impacts the business idea (e.g., \'Positive\', \'Negative\', \'Creates opportunity for X\')\",\n      \"timeframe\": \"Timeframe of the trend\'s relevance (e.g., \'Ongoing\', \'Next 2-3 years\')\"\n    }\n  ],\n  \"marketDrivers\": [\n    {\n      \"driver\": \"Name of a key market driver\",\n      \"description\": \"Brief description of the driver\",\n      \"impact\": \"How this driver impacts the business idea\"\n    }\n  ],\n  \"marketChallenges\": [\n    {\n      \"challenge\": \"Name of a key market challenge\",\n      \"description\": \"Brief description of the challenge\",\n      \"impact\": \"How this challenge impacts the business idea\",\n      \"mitigation\": \"Potential strategy to mitigate the challenge\"\n    }\n  ]\n}\n

Ensure:\n1. ALL top-level keys are present: \`totalAddressableMarket\`, \`serviceableAddressableMarket\`, \`serviceableObtainableMarket\`, \`growthRate\`, \`marketTrends\`, \`marketDrivers\`, \`marketChallenges\`.\n2. Market size numbers should be specific and include sources where possible.\n3. Growth rate (\`growthRate.current\` or \`growthRate.projected\`) should be clearly stated.\n4. Include 2-4 growth factors (\`growthRate.factors\`).\n5. Include 1-3 items each for market trends, drivers, and challenges.\n6. All descriptions should be concise but informative.\n

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

Develop a comprehensive and actionable go-to-market strategy in the following EXACT JSON format, including channel-specific details and a phased rollout:
{
  "launchStrategy": {
    "phases": [
      {
        "phase": "Phase name (e.g., Pre-Launch, Soft Launch, Public Launch)",
        "timeline": "Phase timeline (e.g., Month 1, Q3 2024)",
        "activities": ["List of key activities for this phase"],
        "metrics": ["List of success metrics for this phase"]
      }
    ]
  },
  "keyPartnerships": [
    {
      "partner": "Partner name or type",
      "type": "Partnership type (e.g., Channel, Technology, Marketing)",
      "value": "Value proposition for the partnership"
    }
  ],
  "resourceRequirements": {
    "team": ["List of key team roles/skills needed"],
    "budget": "Estimated budget or range (e.g., '$10k', 'Low')",
    "technology": ["List of essential technology requirements"]
  },
  "channelStrategies": [
    {
      "channel": "Marketing/Acquisition channel name (e.g., SEO, Content Marketing, Paid Ads)",
      "strategy": "Specific strategy for this channel",
      "estimatedCAC": "Estimated CAC as a number or range/qualifier (e.g., '$50', 'Medium')"
    }
  ],
  "industryConversionBenchmarks": "Provide relevant industry conversion rate benchmarks as a string (e.g., 'Industry average conversion rate for SaaS free trials is 2-5%')",
  "phasedRolloutPlan": [
    {
      "phase": "Rollout phase name (e.g., Beta Test, Early Adopters, General Availability)",
      "timeline": "Timeline for this phase",
      "userTarget": "Target number of users or descriptor (e.g., '100 beta users', '1k MAU')",
      "revenueTarget": "Target revenue or descriptor (e.g., '$5k MRR', 'Achieve profitability')",
      "keyActivities": ["List of key activities specific to this rollout phase"]
    }
  ]
}

Ensure:
1. Include 3-4 logical launch phases.
2. Identify 2-3 potential key partnerships (or state if none are apparent).
3. Resource requirements should be realistic.
4. Include 3-5 relevant channel strategies with specific tactics and estimated CAC.
5. Provide realistic conversion benchmarks.
6. Detail a 2-3 phase rollout plan with clear targets and activities.
7. All timelines should be practical.
8. Metrics should be specific and measurable.

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
       "total": "Total investment volume in the relevant sector/timeframe. (e.g., '$9.5B')",
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
    criticalThoughtQuestions: `${jsonDirective}

${baseContext}

Analyze the business idea critically and provide the 5 most crucial questions the founder must address for validation. For each question, provide analysis, implications, priority, and *actionable* recommendations in the following EXACT JSON format:
{
  "questions": [
    {
      "category": "Critical Area (e.g., Market Demand, User Value, Competition, Business Model, Feasibility)",
      "question": "The single most critical question in this category",
      "analysis": "Detailed analysis explaining why this question is critical, citing data/assumptions",
      "priority": "high" | "medium" | "low",
      "implications": ["List 2-3 key implications if this question isn't addressed"],
      "recommendations": [
        {
          "step": "Specific, actionable next step to help answer the question",
          "resourcesNeeded": ["List resources (e.g., Tool, Time, Skill, Budget Estimate)"],
          "decisionCriteria": "Clear criteria for proceed/pivot/halt based on this step's outcome",
          "timeline": "Estimated timeline (e.g., '1 week', 'Month 1')",
          "priority": "high" | "medium" | "low"
        }
      ]
    }
  ],
  "riskAssessment": {
    "highPriority": ["List 1-3 immediate risks that could derail the business"],
    "mediumPriority": ["List 2-4 significant challenges that need addressing"],
    "lowPriority": ["List 2-4 potential issues to monitor"]
  }
}

Focus on the 5 most critical areas for THIS specific business idea.
Ensure:
1. Exactly 5 question objects are provided.
2. Each recommendation includes ALL fields: step, resourcesNeeded, decisionCriteria, timeline, priority.
3. Priorities must be exactly "high", "medium", or "low".
4. Analysis is insightful and links to the business idea.
5. Implications are specific and impactful.
6. Recommendations are concrete actions, not vague advice.
7. Risk assessment is concise and prioritized.

IMPORTANT: Return ONLY the JSON object, no other text.`,
    validationRoadmap: `${jsonDirective}

${baseContext}

Based on the business idea, create a prioritized validation roadmap in the following EXACT JSON format:
{
  "coreHypotheses": [
    {
      "hypothesis": "State a core assumption the business relies on (e.g., Users will pay $X for Y)",
      "priority": "high" | "medium" | "low"
    }
  ],
  "hypothesisExperiments": [
    {
      "hypothesis": "The core assumption being tested (must match one from above)",
      "experiment": "Describe a specific, low-cost experiment to test this hypothesis (e.g., Landing page test, User interviews, Fake door test)",
      "successMetric": "Define a clear, measurable success metric for the experiment (e.g., 10% conversion rate, 5/10 interviewees confirm need)"
    }
  ],
  "validationTimeline": {
    "days30": ["List 2-3 specific, achievable validation goals for the first 30 days"],
    "days60": ["List 2-3 specific, achievable validation goals for days 31-60"],
    "days90": ["List 2-3 specific, achievable validation goals for days 61-90"]
  }
}

Ensure:
1. Identify 3-5 core hypotheses, prioritized.
2. Define at least one specific experiment per hypothesis with a clear success metric.
3. Outline clear, actionable goals for the 30-day, 60-day, and 90-day validation timeline.
4. Ensure experiments are practical and focused on validation.
5. Priorities must be exactly "high", "medium", or "low".

IMPORTANT: Return ONLY the JSON object, no other text.`,
    keyPerformanceIndicators: `${jsonDirective}

${baseContext}

Identify the most critical Key Performance Indicators (KPIs) the founder should track during the initial validation phase (first 90 days). Provide target values and measurement methods in the following EXACT JSON format:
{
  "criticalMetrics": [
    {
      "metric": "Name of the KPI (e.g., Website Visitors, Conversion Rate, User Engagement)",
      "description": "Briefly explain why this metric is critical for validation",
      "targetValue": "Set a specific target value or range for the first 90 days (e.g., '1000 visitors', '2% CVR', 'Increase MAU by 10%')",
      "timeframe": "Usually 'First 90 Days' for this context, but can specify shorter if applicable"
    }
  ],
  "measurementMethods": [
    {
      "metric": "The KPI name (must match one from criticalMetrics)",
      "tools": ["List specific tools recommended for tracking (e.g., Google Analytics, Mixpanel, Simple Spreadsheet)"],
      "method": "Describe the method or process for measurement (e.g., 'Track landing page views in GA', 'Manual calculation weekly')"
    }
  ]
}

Ensure:
1. Identify 3-5 critical KPIs relevant to the validation stage.
2. Provide specific, measurable target values or clear qualitative goals.
3. Recommend practical tools and methods for tracking each KPI.
4. Focus on leading indicators relevant to early validation.

IMPORTANT: Return ONLY the JSON object, no other text.`,
    experimentDesign: `${jsonDirective}

${baseContext}

Outline specific, low-cost experiments and research methods to test the riskiest assumptions of this business idea in the following EXACT JSON format:
{
  "mvpPrototypes": [
    {
      "type": "Type of MVP/Prototype (e.g., Landing Page, Concierge MVP, Wizard of Oz, Mockup)",
      "description": "Brief description of how this MVP/prototype works",
      "assumptionsTested": ["List the specific core assumptions this experiment aims to validate"]
    }
  ],
  "customerInterviewFramework": {
    "purpose": "State the primary goal of initial customer interviews (e.g., Validate problem, Understand pain points, Gauge interest)",
    "keyQuestions": [
      "List 5-7 open-ended key questions to ask potential customers",
      "Example: Tell me about the last time you faced [problem]?",
      "Example: What solutions have you tried for [problem]?",
      "Example: How much would you be willing to pay for a solution?"
    ]
  },
  "abTestingRecommendations": [
    {
      "featureOrMessage": "Identify a critical feature, value proposition, or marketing message to A/B test early on",
      "variants": ["Describe Variant A", "Describe Variant B"],
      "successMetric": "Define the key metric to determine the winning variant (e.g., Click-through rate, Sign-up conversion)"
    }
  ]
}

Ensure:
1. Recommend 1-2 practical MVP/Prototype ideas suitable for early testing.
2. Clearly link MVPs to the assumptions they test.
3. Provide a focused purpose and 5-7 insightful questions for customer interviews.
4. Include 1-2 high-impact A/B testing recommendations IF appropriate for early validation (otherwise, provide an empty array).
5. All suggestions should be low-cost and aimed at learning quickly.

IMPORTANT: Return ONLY the JSON object, no other text.`,
    reportSummary: `${jsonDirective}

${baseContext}

Provide a final summary of the analysis, including key findings, an overall recommendation, and actionable next steps in the following EXACT JSON format:
{
  "summary": "Comprehensive 2-4 sentence summary of the entire analysis, highlighting the key takeaway",
  "keyFindings": ["List the top 5-7 most crucial findings from all analysis sections"],
  "overallRecommendation": "Proceed" | "Pivot" | "Halt",
  "recommendations": [
      {
        "category": "Key area for recommendations (e.g., Validation, Product, Market)",
        "items": [
          {
            "step": "Specific, actionable recommendation",
            "resourcesNeeded": ["List resources (e.g., Tool, Time, Skill, Budget Estimate)"],
            "decisionCriteria": "Clear criteria for evaluating success",
            "timeline": "Estimated timeline (e.g., 'Next 2 weeks', 'Q3')",
            "priority": "high" | "medium" | "low"
          }
        ],
        "priority": "high" | "medium" | "low" // Priority for the category
      }
  ],
  "nextSteps": [
    {
      "step": "The immediate next action the founder should take (usually related to high-priority recommendations)",
      "resourcesNeeded": ["List resources"],
      "decisionCriteria": "Criteria for this immediate step",
      "timeline": "Timeline (e.g., 'This week')",
      "priority": "high"
    }
  ]
}

Ensure:
1. The summary is concise yet comprehensive.
2. Include 5-7 key findings from the analysis.
3. The overall recommendation must be exactly "Proceed", "Pivot", or "Halt".
4. Provide 2-3 recommendation categories, each with 1-3 actionable items following the specified structure.
5. Include 1-3 immediate, high-priority next steps, also following the actionable item structure.
6. Ensure all priorities are "high", "medium", or "low".
7. All action items (recommendations/next steps) have all required fields filled.

IMPORTANT: Return ONLY the JSON object, no other text.`
  };

  return prompts[section];
} 