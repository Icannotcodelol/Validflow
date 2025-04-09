import { NextRequest, NextResponse } from "next/server";
import { Orchestrator } from '@/lib/ai/orchestrator';
import { auth } from "@/auth";
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from "@/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerComponentClient<Database>({ cookies });
    const orchestrator = new Orchestrator(supabase);
    
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

    const supabase = createServerComponentClient<Database>({ cookies });
    const orchestrator = new Orchestrator(supabase);
    const analysis = await orchestrator.getAnalysis(analysisId);

    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }

    if (analysis.user_id !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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