import { openai, anthropic, queryPerplexity } from './ai-clients';

interface MarketData {
  totalAddressableMarket: string;
  growthRate: string;
  targetUsers: string;
  segments: Array<{
    name: string;
    size: string;
    description: string;
    characteristics: string[];
  }>;
}

interface CompetitorData {
  name: string;
  type: string;
  marketShare: string;
  strengths: string[];
  weaknesses: string[];
  pricing: {
    starter: string;
    premium: string;
  };
}

interface FinancialData {
  projections: Array<{
    year: string;
    users: string;
    revenue: string;
    costs: string;
    profit: string;
  }>;
  assumptions: string[];
}

export async function generateMarketData(productIdea: string): Promise<MarketData> {
  const prompt = `Given this product idea: "${productIdea}", generate realistic market data including total addressable market, growth rate, target users, and market segments. Format as JSON.`;
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error generating market data:', error);
    throw error;
  }
}

export async function generateCompetitorData(productIdea: string): Promise<CompetitorData[]> {
  const prompt = `Analyze the competitive landscape for this product idea: "${productIdea}". Generate data about 3-4 key competitors including their type, market share, strengths, weaknesses, and pricing. Format as JSON array.`;
  
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    });

    // Extract the content from the response
    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating competitor data:', error);
    throw error;
  }
}

export async function generateFinancialData(productIdea: string): Promise<FinancialData> {
  const prompt = `Create realistic 3-year financial projections for this product idea: "${productIdea}". Include user growth, revenue, costs, profit, and key assumptions. Format as JSON.`;
  
  try {
    const response = await queryPerplexity(prompt);
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error generating financial data:', error);
    throw error;
  }
}

export async function generateAllDashboardData(productIdea: string) {
  try {
    const [marketData, competitorData, financialData] = await Promise.all([
      generateMarketData(productIdea),
      generateCompetitorData(productIdea),
      generateFinancialData(productIdea)
    ]);

    return {
      marketData,
      competitorData,
      financialData
    };
  } catch (error) {
    console.error('Error generating dashboard data:', error);
    throw error;
  }
} 