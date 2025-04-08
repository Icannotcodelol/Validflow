import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/lib/auth'

const supabase = createClient()

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Create user_credits record
    const { error: creditsError } = await supabase
      .from('user_credits')
      .insert({
        user_id: data.user!.id,
        free_analysis_used: false
      })

    if (creditsError) {
      console.error('Failed to create user credits:', creditsError)
    }

    return NextResponse.json({
      user: data.user,
      message: "Check your email for the confirmation link"
    })
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
} 