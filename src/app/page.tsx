"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Lightbulb } from "lucide-react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import { Button } from "@/components/ui/button"
import { Hero } from "@/components/sections/Hero"
import { MiniDemo } from "@/components/sections/MiniDemo"
import { Testimonials } from "@/components/sections/Testimonials"
import { HowItWorks } from "@/components/sections/HowItWorks"
import { Footer } from "@/components/Footer"
import { PromotionalBanner } from "@/components/PromotionalBanner"

export default function Home() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = useState(false)
  const [session, setSession] = useState<any>(null)
  const [isAuthChecking, setIsAuthChecking] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        setSession(currentSession)
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        setIsAuthChecking(false)
      }
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleTryValidFlow = async () => {
    setIsLoading(true)
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      
      if (!currentSession) {
        console.log('No session found, redirecting to signin')
        router.push('/signin')
        return
      }

      console.log('Session found:', currentSession)

      const { data: credits, error: creditsError } = await supabase
        .from('user_credits')
        .select('credits_balance, has_unlimited, unlimited_until')
        .eq('user_id', currentSession.user.id)
        .single()

      console.log('Credits data:', credits)
      console.log('Credits error:', creditsError)

      if (creditsError || !credits) {
        const { data: newCredits, error: insertError } = await supabase
          .from('user_credits')
          .insert({
            user_id: currentSession.user.id,
            credits_balance: 3,
            has_unlimited: false
          })
          .select()
          .single()

        console.log('New credits created:', newCredits)
        console.log('Insert error:', insertError)

        if (!insertError && newCredits) {
          router.push('/validate')
        } else {
          console.error('Error creating credits:', insertError)
          router.push('/validate')
        }
      } else {
        const now = new Date()
        const hasValidUnlimited = credits.has_unlimited && 
          (credits.unlimited_until === null || new Date(credits.unlimited_until) > now)

        if (hasValidUnlimited || credits.credits_balance > 0) {
          router.push('/validate')
        } else {
          router.push('/pricing')
        }
      }
    } catch (error) {
      console.error('Error in handleTryValidFlow:', error)
      router.push('/validate')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {!session && !isAuthChecking && <PromotionalBanner />}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <Lightbulb className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold">ValidFlow</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          {!isAuthChecking && (
            session ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/settings">Settings</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )
          )}
        </div>
      </header>

      <main className="flex-1">
        <Hero onTryValidFlow={handleTryValidFlow} isLoading={isLoading} />
        <section className="py-24 md:py-32">
          <HowItWorks />
        </section>
        <section className="py-24 md:py-32 bg-muted/50">
          <Testimonials />
        </section>
        <section className="py-24 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Try Our Mini Demo</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Get a quick taste of how our AI-powered validation works. Enter your idea and see instant insights.
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <MiniDemo />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
} 