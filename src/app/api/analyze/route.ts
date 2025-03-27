import { NextRequest, NextResponse } from "next/server";
import { Orchestrator } from '@/lib/ai/orchestrator';
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { analysisId, sectionKey, data } = body;

    if (!analysisId || !sectionKey || !data) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const orchestrator = new Orchestrator();
    await orchestrator.updateAnalysisSection(analysisId, sectionKey, data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update analysis section:", error);
    return NextResponse.json(
      { error: "Failed to update analysis section" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const analysisId = searchParams.get('analysisId');

    if (!analysisId) {
      return NextResponse.json({
        success: false,
        message: 'Analysis ID is required'
      }, { status: 400 });
    }

    const orchestrator = new Orchestrator();
    const analysis = await orchestrator.getAnalysis(analysisId);

    if (!analysis) {
      return NextResponse.json({
        success: false,
        message: 'Analysis not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Failed to fetch analysis:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch analysis'
    }, { status: 500 });
  }
} 