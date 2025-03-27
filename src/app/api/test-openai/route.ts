import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    console.log('Testing OpenAI API...', {
      hasApiKey: !!process.env.OPENAI_API_KEY,
      apiKeyPrefix: process.env.OPENAI_API_KEY?.substring(0, 8),
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: 'Say hello in JSON format: { "greeting": "Hello!" }' }],
      temperature: 0.7,
      max_tokens: 100,
      response_format: { type: 'json_object' },
    });

    console.log('OpenAI API Response:', {
      hasChoices: !!response.choices,
      choicesLength: response.choices?.length,
      hasContent: !!response.choices?.[0]?.message?.content,
      usage: response.usage
    });

    return NextResponse.json({
      success: true,
      response: response.choices[0].message.content
    });
  } catch (error) {
    console.error('OpenAI API test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 