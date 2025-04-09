import { NextRequest, NextResponse } from "next/server";
import { Orchestrator } from "@/lib/ai/orchestrator";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerComponentClient<Database>({ 
      cookies: cookies,
    });
    
    const orchestrator = new Orchestrator(supabase);

    const analysis = await orchestrator.getAnalysis(params.id);
    
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