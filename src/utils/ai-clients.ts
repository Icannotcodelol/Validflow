import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryWithBackoff<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0 || !isRetryableError(error)) {
      throw error;
    }
    
    console.log(`Retrying after error: ${error}. Retries left: ${retries}`);
    await sleep(RETRY_DELAY * (MAX_RETRIES - retries + 1));
    return retryWithBackoff(fn, retries - 1);
  }
}

function isRetryableError(error: any): boolean {
  if (error?.message?.includes('overloaded')) return true;
  if (error?.status === 529) return true;
  if (error?.statusText?.includes('Service Unavailable')) return true;
  return false;
}

// Initialize the OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize the Anthropic client
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

if (!process.env.PERPLEXITY_API_KEY) {
  throw new Error("Missing PERPLEXITY_API_KEY environment variable");
}

// Initialize Perplexity client (using fetch as they don't have an official Node.js SDK)
export async function queryPerplexity(prompt: string) {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    throw new Error('Missing PERPLEXITY_API_KEY environment variable');
  }

  if (!apiKey.startsWith('pplx-')) {
    throw new Error('Invalid Perplexity API key format. Key should start with "pplx-"');
  }

  // Log API key prefix for debugging
  console.log('Perplexity API Debug:', {
    hasApiKey: !!apiKey,
    apiKeyPrefix: apiKey.substring(0, 8),
    apiKeyLength: apiKey.length,
    promptLength: prompt.length
  });

  return retryWithBackoff(async () => {
    const requestBody = {
      model: 'sonar-deep-research',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      stream: false
    };

    // Log full request details
    console.log('Perplexity API Request:', {
      url: 'https://api.perplexity.ai/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody, null, 2)
    });

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    // Log response details
    console.log('Perplexity API Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorText,
        requestHeaders: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.substring(0, 8)}...`,
          'Accept': 'application/json'
        }
      });
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const data = await response.json();
    
    // Log successful response data
    console.log('Perplexity API Success:', {
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length,
      hasMessage: !!data.choices?.[0]?.message,
      hasContent: !!data.choices?.[0]?.message?.content,
      usage: data.usage
    });

    return data;
  });
}

// Helper function for Anthropic Claude
export async function queryClaude(prompt: string) {
  return retryWithBackoff(async () => {
    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-sonnet',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      });

      console.log('Claude API response received:', {
        hasContent: !!response.content,
        contentLength: response.content?.length,
        firstContentType: response.content?.[0]?.type
      });

      return response;
    } catch (error) {
      console.error('Error in queryClaude:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      }
      throw error;
    }
  });
}

// Helper function for OpenAI GPT-4
export async function queryGPT4(prompt: string) {
  return retryWithBackoff(async () => {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 4000
      });

      return response;
    } catch (error) {
      console.error('Error in queryGPT4:', error);
      throw error;
    }
  });
} 