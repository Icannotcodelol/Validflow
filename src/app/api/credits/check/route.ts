import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: userCredits, error } = await supabase
      .from("user_credits")
      .select("*")
      .eq("user_id", session.user.email)
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch credits" },
        { status: 500 }
      );
    }

    const now = new Date();
    const hasUnlimitedAccess = userCredits.has_unlimited && 
      userCredits.unlimited_until && 
      new Date(userCredits.unlimited_until) > now;

    return NextResponse.json({
      credits: userCredits.credits_balance,
      hasUnlimitedAccess
    });
  } catch (error) {
    console.error("Credits check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 