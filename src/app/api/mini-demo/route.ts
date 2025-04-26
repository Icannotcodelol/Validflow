import { NextResponse } from 'next/server';
import { anthropic } from '@/utils/ai-clients';

export async function POST(request: Request) {
  try {
    console.log('Mini-demo API called');
    const { productName, description, targetMarket } = await request.json();
    
    console.log('Input data:', { productName, description, targetMarket });

    // Validate input
    if (!productName || !description || !targetMarket) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create prompt for Claude
    const prompt = `You are a business analyst. Analyze this business idea and provide a quick assessment.

Product Name: ${productName}
Description: ${description}
Target Market: ${targetMarket}

Provide a concise analysis with exactly these sections:
1. Market Size - Include total addressable market size and growth rate
2. Competition - Number of direct competitors and market opportunity
3. Target Users - Primary audience demographics and characteristics
4. Recommendation - Whether to proceed and key focus areas

Keep each section to 1-2 sentences maximum. Format as JSON with these exact keys:
{
  "marketSize": "...",
  "competition": "...",
  "targetUsers": "...",
  "recommendation": "..."
}`;

    console.log('Calling Claude API...');
    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });

    console.log('Claude API response received');
    console.log('Raw response:', response);

    // Extract and parse the response
    if (!response.content || response.content.length === 0) {
      console.error('Empty response from Claude');
      throw new Error('Empty response from Claude');
    }

    const content = response.content[0].type === 'text' 
      ? response.content[0].text 
      : JSON.stringify(response.content[0]);

    console.log('Extracted content:', content);

    // Try to extract JSON if the response contains surrounding text
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Failed to parse Claude response - no JSON found:', content);
      throw new Error('Failed to parse Claude response as JSON');
    }

    let analysis;
    try {
      analysis = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Attempted to parse:', jsonMatch[0]);
      throw new Error('Invalid JSON in Claude response');
    }

    // Validate the analysis object has all required fields
    const requiredFields = ['marketSize', 'competition', 'targetUsers', 'recommendation'];
    const missingFields = requiredFields.filter(field => !analysis[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields in analysis:', missingFields);
      throw new Error(`Analysis missing required fields: ${missingFields.join(', ')}`);
    }

    console.log('Final analysis:', analysis);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in mini-demo analysis:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze business idea',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 