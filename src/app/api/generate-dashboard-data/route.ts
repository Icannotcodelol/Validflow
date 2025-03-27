import { NextResponse } from 'next/server';
import { generateAllDashboardData } from '@/utils/generate-sample-data';

export async function POST(request: Request) {
  try {
    const { productIdea } = await request.json();

    if (!productIdea) {
      return NextResponse.json(
        { error: 'Product idea is required' },
        { status: 400 }
      );
    }

    const dashboardData = await generateAllDashboardData(productIdea);
    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error generating dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to generate dashboard data' },
      { status: 500 }
    );
  }
} 