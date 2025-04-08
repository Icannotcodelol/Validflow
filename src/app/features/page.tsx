import { BarChart3, Brain, CheckCircle, Clock, Code2, FileText, Lightbulb, Target, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function FeaturesPage() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Our advanced AI engine analyzes your business idea across multiple dimensions, providing comprehensive insights and recommendations."
    },
    {
      icon: BarChart3,
      title: "Market Research",
      description: "Get detailed market size analysis, competitor landscape, and industry trends to understand your opportunity."
    },
    {
      icon: Target,
      title: "Target User Analysis",
      description: "Identify and understand your ideal customer segments with detailed demographic and psychographic insights."
    },
    {
      icon: FileText,
      title: "Financial Projections",
      description: "Generate realistic financial forecasts with our interactive revenue calculator and unit economics analysis."
    },
    {
      icon: Clock,
      title: "Go-to-Market Timeline",
      description: "Receive a detailed implementation plan with clear phases, milestones, and resource requirements."
    },
    {
      icon: Zap,
      title: "VC Sentiment Analysis",
      description: "Understand how venture capitalists would view your idea with our investment attractiveness scoring."
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <Lightbulb className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold">ValidFlow</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/about">
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
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Powerful Features for Idea Validation
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Validate your business idea with our comprehensive suite of AI-powered tools and analytics
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
              {features.map((feature, index) => (
                <div key={index} className="relative overflow-hidden rounded-lg border bg-background p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-12">
              <Link href="/validate">
                <Button size="lg">
                  Start Validating Your Idea
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2024 ValidFlow. All rights reserved.</p>
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