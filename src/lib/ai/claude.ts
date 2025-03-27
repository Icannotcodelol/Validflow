import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function callClaude(prompt: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  return response.content[0].type === 'text' 
    ? response.content[0].text 
    : JSON.stringify(response.content[0]);
} 