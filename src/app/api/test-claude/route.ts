import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function GET() {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 100,
      messages: [{ role: 'user', content: 'Say hello in JSON format: { "greeting": "Hello!" }' }],
    });

    return NextResponse.json({
      success: true,
      response: response.content[0].type === 'text' ? response.content[0].text : 'Invalid response type'
    });
  } catch (error) {
    console.error('Claude API test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 