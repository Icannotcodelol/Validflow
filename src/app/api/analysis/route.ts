import { NextRequest, NextResponse } from "next/server";
import { Orchestrator } from '@/lib/ai/orchestrator';
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orchestrator = new Orchestrator();
    const analysisId = await orchestrator.createAnalysis(session.user.id);

    return NextResponse.json({ analysisId });
  } catch (error) {
    console.error("Failed to create analysis:", error);
    return NextResponse.json(
      { error: "Failed to create analysis" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const analysisId = searchParams.get("id");

    if (!analysisId) {
      return NextResponse.json({ error: "Analysis ID required" }, { status: 400 });
    }

    const orchestrator = new Orchestrator();
    const analysis = await orchestrator.getAnalysis(analysisId);

    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }

    if (analysis.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Failed to get analysis:", error);
    return NextResponse.json(
      { error: "Failed to get analysis" },
      { status: 500 }
    );
  }
} 