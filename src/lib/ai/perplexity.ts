interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface PerplexityQuery {
  model: string;
  messages: Message[];
}

export class Perplexity {
  private apiKey: string;
  private baseUrl = 'https://api.perplexity.ai/chat/completions';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async query({ model, messages }: PerplexityQuery): Promise<string> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model,
          messages
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Perplexity API error: ${error.message || response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling Perplexity API:', error);
      throw error;
    }
  }
} 