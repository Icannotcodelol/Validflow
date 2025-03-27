import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateContent(
  idea: string,
  marketResearch: string,
  analysis: string
) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a professional business content writer specializing in transforming technical analysis into clear, engaging content. Your task is to create polished content sections based on the provided business analysis.

Output Structure:
{
  "sections": {
    "overview": {
      "title": "Business Overview",
      "content": "Professional introduction of the business concept",
      "highlights": ["Key points in bullet form"]
    },
    "marketOpportunity": {
      "title": "Market Opportunity",
      "content": "Clear explanation of the market potential",
      "statistics": ["Key market statistics"],
      "trends": ["Relevant market trends"]
    },
    "valueProposition": {
      "title": "Value Proposition",
      "content": "Compelling description of unique value",
      "keyBenefits": ["Main benefits"],
      "differentiators": ["Unique selling points"]
    },
    "strategy": {
      "title": "Business Strategy",
      "content": "Clear explanation of approach",
      "phases": ["Strategic phases"],
      "milestones": ["Key milestones"]
    },
    "financials": {
      "title": "Financial Overview",
      "content": "Clear financial narrative",
      "keyMetrics": ["Important financial indicators"],
      "projections": ["Growth projections"]
    }
  }
}

Requirements:
1. Use clear, professional language
2. Focus on actionable insights
3. Format for easy scanning
4. Include specific examples
5. Use industry-standard terminology
6. Maintain consistent tone
7. Emphasize unique value
8. Include relevant metrics
9. Focus on reader benefits
10. Ensure logical flow

Return the content in valid JSON format exactly matching the structure above.`,
        },
        {
          role: 'user',
          content: `Business Idea: ${idea}
Market Research: ${marketResearch}
Analysis: ${analysis}

Please transform this technical analysis into polished content sections following the specified structure.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error in OpenAI API:', error);
    throw error;
  }
} 