import { NextRequest, NextResponse } from "next/server";
import { Orchestrator } from '@/lib/ai/orchestrator';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';
import { processAnalysis } from '@/lib/ai/analysis-processor';

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerComponentClient<Database>({ cookies });
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user?.id) {
      console.error('Auth error:', userError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`[analyze API] User authenticated: ${user.id}`);

    const body = await req.json();
    console.log('[analyze API] Received request body:', body);
    
    // Handle initial form submission
    if (body.description) {
      try {
        const orchestrator = new Orchestrator(supabase);
        console.log(`[analyze API] Attempting to create analysis for user: ${user.id}`);
        const analysisId = await orchestrator.createAnalysis(user.id);
        console.log(`[analyze API] Created analysis with ID: ${analysisId}`);
        
        // Store the initial form data
        await orchestrator.updateAnalysisSection(analysisId, 'formData', {
          description: body.description,
          industry: body.industry,
          subIndustry: body.subIndustry,
          targetCustomers: body.targetCustomers,
          pricingModel: body.pricingModel,
          currentStage: body.currentStage,
          teamComposition: body.teamComposition,
          additionalInfo: body.additionalInfo,
        });

        console.log(`[analyze API] Successfully stored form data for analysis ID: ${analysisId}`);

        // Start processing the analysis in the background
        console.log(`[analyze API] Attempting to start background processing for analysis ID: ${analysisId}`);
        processAnalysis(analysisId, body, orchestrator).catch(error => {
          console.error('[analyze API] Error during background processing initiation:', error);
          orchestrator.updateAnalysisStatus(analysisId, 'failed')
            .catch(err => console.error('[analyze API] Error updating analysis status after background error:', err));
        });

        console.log(`[analyze API] Successfully created analysis ID: ${analysisId}`);

        return NextResponse.json({ 
          success: true,
          analysisId 
        });
      } catch (error) {
        console.error('[analyze API] Error in initial analysis creation block:', error);
        return NextResponse.json(
          { error: error instanceof Error ? error.message : "Failed to create analysis" },
          { status: 500 }
        );
      }
    }
    
    // Handle section updates
    const { analysisId, sectionKey, data } = body;
    if (!analysisId || !sectionKey || !data) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const orchestrator = new Orchestrator(supabase);
    await orchestrator.updateAnalysisSection(analysisId, sectionKey, data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to process analysis:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process analysis" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerComponentClient<Database>({ cookies });
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user?.id) {
      console.error('Auth error:', userError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const analysisId = searchParams.get('analysisId');

    if (!analysisId) {
      return NextResponse.json({
        success: false,
        message: 'Analysis ID is required'
      }, { status: 400 });
    }

    const orchestrator = new Orchestrator(supabase);
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