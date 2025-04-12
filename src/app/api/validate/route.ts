import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await req.json();
    
    // Validate required fields
    if (!data.productDescription || !data.industry || !data.targetCustomers || 
        !data.pricingModel || !data.currentStage || !data.teamComposition) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check user credits
    const { data: userCredits, error: creditsError } = await supabase
      .from("user_credits")
      .select("*")
      .eq("user_id", session.user.email)
      .single();

    if (creditsError) {
      return NextResponse.json(
        { error: "Failed to verify credits" },
        { status: 500 }
      );
    }

    const now = new Date();
    const hasValidUnlimited = userCredits.has_unlimited && 
      userCredits.unlimited_until && 
      new Date(userCredits.unlimited_until) > now;

    if (!hasValidUnlimited && userCredits.credits_balance === 0) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
    }

    // Create analysis record
    const { data: analysis, error: analysisError } = await supabase
      .from("analyses")
      .insert([
        {
          user_id: session.user.email,
          product_description: data.productDescription,
          industry: data.industry,
          sub_industry: data.subIndustry,
          target_customers: data.targetCustomers,
          pricing_model: data.pricingModel,
          current_stage: data.currentStage,
          team_composition: data.teamComposition,
          additional_info: data.additionalInfo,
          status: "pending"
        }
      ])
      .select()
      .single();

    if (analysisError) {
      return NextResponse.json(
        { error: "Failed to create analysis" },
        { status: 500 }
      );
    }

    // Deduct credit if not unlimited
    if (!hasValidUnlimited) {
      const { error: updateError } = await supabase
        .from("user_credits")
        .update({ credits_balance: userCredits.credits_balance - 1 })
        .eq("user_id", session.user.email);

      if (updateError) {
        return NextResponse.json(
          { error: "Failed to update credits" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ id: analysis.id });
  } catch (error) {
    console.error("Validation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 