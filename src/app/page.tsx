"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, BarChart3, CheckCircle, ChevronRight, Lightbulb, Target } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TypingAnimation } from "@/components/typing-animation"
import { productIdeas } from "@/lib/product-ideas"

interface Detail {
  title: string
  content: string
}

interface Dimension {
  name: string
  score: number
  description: string
  details: Detail[]
}

export default function Home() {
  const [selectedDimension, setSelectedDimension] = useState<Dimension | null>(null)

  const dimensions: Dimension[] = [
    {
      name: "Market Opportunity",
      score: 85,
      description:
        "The SaaS productivity space is expected to grow at 12% CAGR over the next 5 years, creating a favorable environment for new entrants with differentiated offerings. TaskFlow AI targets a growing market with significant potential.",
      details: [
        {
          title: "Market Size",
          content: "The global productivity software market is valued at $102B and expected to reach $185B by 2030.",
        },
        {
          title: "Growth Rate",
          content: "12% CAGR in the productivity SaaS segment, outpacing the overall software market.",
        },
        {
          title: "Target Segment",
          content: "Knowledge workers and teams (estimated 850M globally) represent a massive addressable market.",
        },
        {
          title: "Market Trends",
          content: "Increasing demand for AI-powered tools that reduce cognitive load and automate routine decisions.",
        },
      ],
    },
    {
      name: "Problem Validation",
      score: 80,
      description:
        "The problem being addressed is real and significant for the target audience. There's evidence that current solutions don't fully address the pain points identified, creating an opportunity for TaskFlow AI.",
      details: [
        {
          title: "Pain Point Validation",
          content:
            "Studies show knowledge workers spend 41% of their time on tasks that could be automated or delegated.",
        },
        {
          title: "User Research",
          content: "Interviews with 25 potential users confirmed frustration with manual prioritization.",
        },
        {
          title: "Existing Solutions",
          content: "Current tools require significant manual input to prioritize and schedule tasks.",
        },
        {
          title: "Market Gap",
          content: "Few solutions effectively use AI to reduce the cognitive load of task management.",
        },
      ],
    },
    {
      name: "Solution Differentiation",
      score: 65,
      description:
        "The solution offers some unique features, but could benefit from further differentiation from existing alternatives. Consider focusing more on the unique value proposition to stand out in the market.",
      details: [
        {
          title: "Key Differentiators",
          content: "AI-powered prioritization based on work patterns and deadlines is novel.",
        },
        {
          title: "Competitive Advantage",
          content: "Moderate - the core technology is innovative but could be replicated.",
        },
        {
          title: "Unique Features",
          content: "Automatic scheduling and reprioritization based on changing conditions.",
        },
        { title: "Areas to Strengthen", content: "Need clearer differentiation from emerging AI productivity tools." },
      ],
    },
    {
      name: "Revenue Potential",
      score: 70,
      description:
        "The product shows good revenue potential with a viable business model. The pricing strategy aligns with market expectations, though customer lifetime value could be improved.",
      details: [
        { title: "Pricing Model", content: "Freemium with $15/user/month for premium features is competitive." },
        { title: "Revenue Projections", content: "Potential for $1.2M ARR within 18 months based on adoption rates." },
        { title: "Customer LTV", content: "Estimated at $450 based on industry retention rates." },
        {
          title: "Monetization Strategy",
          content: "Multiple tiers with team/enterprise options provide good scaling potential.",
        },
      ],
    },
    {
      name: "Technical Feasibility",
      score: 90,
      description:
        "The technical implementation is highly feasible with current technologies. The founding team has the necessary technical expertise to build the proposed solution.",
      details: [
        {
          title: "Technology Stack",
          content: "Proposed stack (React, Node.js, Python for ML) is appropriate for the solution.",
        },
        { title: "AI Implementation", content: "Required ML models are well-established with available frameworks." },
        { title: "Development Timeline", content: "MVP timeline of 3 months is realistic given the scope." },
        { title: "Technical Risks", content: "Low - core functionality can be built with proven technologies." },
      ],
    },
    {
      name: "Customer Acquisition",
      score: 50,
      description:
        "The customer acquisition strategy needs significant refinement. The current plan lacks clear channels and has a high estimated CAC relative to the industry benchmark.",
      details: [
        { title: "Acquisition Channels", content: "Overreliance on paid advertising without proven organic channels." },
        {
          title: "Customer Acquisition Cost",
          content: "Estimated CAC of $120 is high compared to industry benchmark of $75.",
        },
        { title: "Go-to-Market Strategy", content: "Lacks clear differentiation in messaging and positioning." },
        {
          title: "Recommendations",
          content: "Develop content marketing strategy and focus on product-led growth tactics.",
        },
      ],
    },
    {
      name: "Competitive Landscape",
      score: 55,
      description:
        "The competitive landscape is crowded with established players. While there's room for innovation, the product will face significant competition from both large platforms and emerging startups.",
      details: [
        { title: "Key Competitors", content: "Asana, ClickUp, Monday.com dominate with 65% market share combined." },
        { title: "Competitive Intensity", content: "High - 15+ established products with similar core functionality." },
        { title: "Barriers to Entry", content: "Moderate - network effects and switching costs benefit incumbents." },
        {
          title: "Competitive Advantage",
          content: "AI capabilities provide short-term advantage but may be quickly replicated.",
        },
      ],
    },
    {
      name: "Founder/Team Fit",
      score: 85,
      description:
        "The founding team is well-positioned to execute on this idea with relevant technical expertise and domain knowledge. The team composition is well-balanced for the challenges ahead.",
      details: [
        {
          title: "Technical Expertise",
          content: "Strong - CTO has 8 years of ML/AI experience and relevant projects.",
        },
        { title: "Domain Knowledge", content: "CEO has worked in productivity software for 5+ years." },
        { title: "Team Composition", content: "Good balance of technical and business expertise." },
        { title: "Identified Gaps", content: "Could benefit from adding marketing expertise to the founding team." },
      ],
    },
  ]

  const handleDimensionClick = (dimension: Dimension) => {
    setSelectedDimension(dimension)
  }

  const handleBackClick = () => {
    setSelectedDimension(null)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <Lightbulb className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold">ValidateMyIdea</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            About
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/signin">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section with background image */}
        <section className="w-full min-h-[80vh] relative flex items-center py-12 md:py-24 lg:py-32 xl:py-48 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
          <div className="container relative pl-8 md:pl-12 pr-4 md:pr-6 z-10">
            <div className="max-w-3xl text-white">
              <div className="relative">
                <div className="space-y-8">
                  <div className="h-[180px] sm:h-[200px]">
                    <TypingAnimation
                      ideas={productIdeas}
                      className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                      staticText="Validate my"
                    />
                  </div>
                  <p className="max-w-[600px] text-white/90 md:text-xl text-left">
                    AI-powered analysis to evaluate your product concept, highlight strengths, weaknesses, and market
                    opportunities before you invest time and resources.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row mt-8">
                <Link href="/validate">
                  <Button size="lg" className="gap-1 bg-black hover:bg-black/90">
                    Validate My Idea <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="bg-black hover:bg-black/90 text-white border-white/20">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section with solid background */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI-powered platform analyzes your product idea across multiple dimensions to provide comprehensive
                  validation insights.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">1. Input Your Idea</h3>
                  <p className="text-muted-foreground">
                    Share details about your product concept, target market, and business model through our structured form.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">2. AI Analysis</h3>
                  <p className="text-muted-foreground">
                    Our AI engine analyzes market trends, competitor landscape, and evaluates your idea across 8 key dimensions.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">3. Get Actionable Insights</h3>
                  <p className="text-muted-foreground">
                    Receive a comprehensive validation report with strengths, weaknesses, and recommendations for your next steps.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Example Analysis Section with background image */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
          <div className="container relative px-4 md:px-6 z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">Example Analysis</h2>
                <p className="max-w-[900px] text-white/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See what insights you'll get from our AI-powered validation platform
                </p>
              </div>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <div className="bg-card rounded-xl border shadow-sm p-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">TaskFlow AI</h3>
                  <p className="text-muted-foreground">
                    An AI-powered task management platform that automatically prioritizes and schedules tasks based on
                    deadlines, importance, and user work patterns.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      SaaS
                    </span>
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      Productivity
                    </span>
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      AI
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-lg">Key Strengths</h4>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" />
                        <span>Strong market opportunity in the growing productivity space</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" />
                        <span>Clear problem validation with existing user pain points</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" />
                        <span>Technical team well-positioned to execute on AI features</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-lg">Areas for Improvement</h4>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li className="flex items-start">
                        <Target className="h-4 w-4 text-destructive mr-2 mt-0.5 shrink-0" />
                        <span>Customer acquisition strategy needs refinement</span>
                      </li>
                      <li className="flex items-start">
                        <Target className="h-4 w-4 text-destructive mr-2 mt-0.5 shrink-0" />
                        <span>Competitive landscape is crowded with established players</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-lg">Top Competitors</h4>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div className="border rounded-lg p-3">
                        <h5 className="font-medium">Asana</h5>
                        <p className="text-xs text-muted-foreground mt-1">
                          Established player with comprehensive features but limited AI capabilities
                        </p>
                      </div>
                      <div className="border rounded-lg p-3">
                        <h5 className="font-medium">ClickUp</h5>
                        <p className="text-xs text-muted-foreground mt-1">
                          Growing rapidly with some AI features but complex interface
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="bg-card rounded-xl border shadow-sm p-6 h-full flex flex-col">
                  <h3 className="text-xl font-bold mb-4">Validation Score</h3>
                  <div className="w-full aspect-square max-w-md mx-auto">
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-4xl font-bold text-primary">72%</div>
                      </div>
                      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="10"
                          strokeDasharray="282.7"
                          strokeDashoffset="79.2"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6 relative">
                    {selectedDimension ? (
                      <div className="col-span-2 animate-fadeIn">
                        <button
                          onClick={handleBackClick}
                          className="absolute -top-2 -left-2 p-1 rounded-full bg-muted hover:bg-muted-foreground/20"
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </button>

                        <div className="flex justify-between items-center mb-2">
                          <span className="text-lg font-medium">{selectedDimension.name}</span>
                          <span className="text-lg font-medium">{selectedDimension.score}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3 mb-4">
                          <div
                            className="bg-primary h-3 rounded-full transition-all duration-500"
                            style={{ width: `${selectedDimension.score}%` }}
                          ></div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-6">{selectedDimension.description}</p>

                        <div className="space-y-4">
                          {selectedDimension.details.map((detail, index) => (
                            <div key={index} className="border rounded-lg p-3">
                              <h5 className="font-medium text-sm">{detail.title}</h5>
                              <p className="text-sm text-muted-foreground mt-1">{detail.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        {dimensions.map((dimension, index) => (
                          <div key={index} className="transition-all duration-300">
                            <button
                              onClick={() => handleDimensionClick(dimension)}
                              className="w-full text-left hover:bg-muted/50 rounded-lg p-2 transition-colors group"
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm group-hover:text-primary flex items-center">
                                  {dimension.name}
                                  <ChevronRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </span>
                                <span className="text-sm font-medium">{dimension.score}%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full"
                                  style={{ width: `${dimension.score}%` }}
                                ></div>
                              </div>
                            </button>
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  <div className={cn("mt-6 pt-6 border-t", selectedDimension ? "hidden" : "block")}>
                    <h4 className="font-medium text-lg mb-2">Key Recommendation</h4>
                    <p className="text-sm text-muted-foreground">
                      Focus on developing a unique AI-driven feature set that clearly differentiates from competitors
                      while developing a more robust customer acquisition strategy.
                    </p>
                    <div className="mt-4">
                      <Link href="/validate">
                        <Button variant="outline" className="w-full">
                          Try With Your Idea
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Validate Your Idea?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Start with our free tier or upgrade to premium for comprehensive insights.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/validate">
                  <Button size="lg">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2025 ValidateMyIdea. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
} 