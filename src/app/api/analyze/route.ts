import { NextRequest, NextResponse } from "next/server";
import { Orchestrator } from '@/lib/ai/orchestrator';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';
import { processAnalysis } from '@/lib/ai/analysis-processor';
import { createClient } from '@/lib/supabase/server';

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

    // Check if this is a section update request
    if (body.analysisId && body.sectionKey) {
      console.log('[analyze API] Processing section update request');
      const orchestrator = new Orchestrator(supabase);
      await orchestrator.updateAnalysisSection(body.analysisId, body.sectionKey, body.data);
      return NextResponse.json({ success: true });
    }
    
    // If we reach here, this is an initial analysis creation request
    // Check user credits/subscription
    const { data: credits, error: creditsError } = await supabase
      .from('user_credits')
      .select('credits_balance, has_unlimited, unlimited_until')
      .eq('user_id', user.id)
      .single();

    if (creditsError) {
      console.error('Error checking credits:', creditsError);
      return NextResponse.json(
        { error: 'Failed to verify credits' },
        { status: 500 }
      );
    }

    const now = new Date();
    const hasValidUnlimited = credits.has_unlimited && 
      credits.unlimited_until && 
      new Date(credits.unlimited_until) > now;

    if (!hasValidUnlimited && credits.credits_balance === 0) {
      return NextResponse.json(
        { error: 'No credits available' },
        { status: 403 }
      );
    }

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

        // Deduct credit BEFORE starting the analysis to prevent multiple deductions
        if (!hasValidUnlimited && credits.credits_balance > 0) {
          console.log(`[analyze API] Deducting credit for user: ${user.id}`);
          const { error: updateError } = await supabase.rpc('add_credits', {
            p_user_id: user.id,
            p_credits: -1
          });

          if (updateError) {
            console.error('Error updating credits:', updateError);
            // Rollback analysis creation if credit deduction fails
            await orchestrator.updateAnalysisStatus(analysisId, 'failed');
            return NextResponse.json(
              { error: 'Failed to process credits' },
              { status: 500 }
            );
          }
          console.log(`[analyze API] Successfully deducted credit for user: ${user.id}`);
        }

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
    
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
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