import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';
import { Orchestrator } from '@/lib/ai/orchestrator';

export async function GET(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Verify session exists
    const session = await supabase.auth.getSession();
    if (!session.data.session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orchestrator = new Orchestrator(supabase);
    const analyses = await orchestrator.getUserAnalyses(session.data.session.user.id);

    return NextResponse.json({
      success: true,
      analyses
    });
  } catch (error) {
    console.error('Failed to fetch analyses:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch analyses'
    }, { status: 500 });
  }
} 