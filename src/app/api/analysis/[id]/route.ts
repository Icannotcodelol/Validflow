import { NextRequest, NextResponse } from "next/server";
import { getAnalysis } from "@/lib/db/analysis";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const analysis = await getAnalysis(params.id);
    
    if (!analysis) {
      return NextResponse.json(
        { error: "Analysis not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error fetching analysis:", error);
    return NextResponse.json(
      { error: "Failed to fetch analysis" },
      { status: 500 }
    );
  }
} 