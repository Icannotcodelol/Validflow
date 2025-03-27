import { NextResponse } from 'next/server';
import { generateMarketingChannels } from '@/lib/ai/sections/marketingChannels';

export async function GET() {
  try {
    // Sample input data for testing
    const testInput = {
      userId: 'test-user',
      description: 'A SaaS platform that helps small businesses manage their social media presence and automate content creation using AI.',
      industry: 'Software & Technology',
      subIndustry: 'Social Media Management',
      targetCustomers: 'Small businesses and entrepreneurs who want to maintain an active social media presence but lack time or expertise',
      pricingModel: 'Subscription-based with tiered pricing: Basic ($29/mo), Pro ($79/mo), Enterprise ($199/mo)',
      currentStage: 'Early Stage / MVP',
      teamComposition: 'Technical founder, marketing specialist, and two developers',
      additionalInfo: 'Currently have a working MVP and 50 beta users with positive feedback'
    };

    const result = await generateMarketingChannels(testInput);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in test-marketing-channels:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
} 