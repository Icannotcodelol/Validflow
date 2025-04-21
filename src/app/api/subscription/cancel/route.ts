import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
})

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get user session
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's subscription data
    const { data: userData, error: userError } = await supabase
      .from('user_credits')
      .select('subscription_id')
      .eq('user_id', session.user.id)
      .single()

    if (userError || !userData?.subscription_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    // Cancel the subscription in Stripe
    const subscription = await stripe.subscriptions.cancel(userData.subscription_id)

    // Update the user's subscription status in the database
    const { error: updateError } = await supabase
      .rpc('remove_unlimited_access', {
        p_user_id: session.user.id
      })

    if (updateError) {
      console.error('Error updating subscription status:', updateError)
      return NextResponse.json(
        { error: 'Failed to update subscription status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Subscription cancelled successfully',
      status: subscription.status
    })

  } catch (error) {
    console.error('Error cancelling subscription:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
} 