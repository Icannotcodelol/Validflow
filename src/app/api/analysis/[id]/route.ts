import { NextRequest, NextResponse } from "next/server";
import { Orchestrator } from "@/lib/ai/orchestrator";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Create Supabase client and Orchestrator instance
    const supabase = createClient(); 
    const orchestrator = new Orchestrator(supabase);

    const analysis = await orchestrator.getAnalysis(params.id);
    
    if (!analysis) {
      return NextResponse.json(
        { error: "Analysis not found" },
        { status: 404 }
      );
    }

    // Return the analysis document (includes status and sections)
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error fetching analysis:", error);
    return NextResponse.json(
      { error: "Failed to fetch analysis" },
      { status: 500 }
    );
  }
} 