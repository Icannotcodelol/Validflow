import { Check, Lightbulb } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PricingPage() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for testing the waters",
      features: [
        "1 idea validation per month",
        "Basic market research",
        "Simple financial projections",
        "Core feature analysis",
        "Email support"
      ],
      cta: "Get Started",
      href: "/signup"
    },
    {
      name: "Pro",
      price: "$49",
      period: "per month",
      description: "Best for serious entrepreneurs",
      features: [
        "5 idea validations per month",
        "Advanced market research",
        "Detailed financial modeling",
        "Competitor analysis",
        "VC sentiment analysis",
        "Priority support",
        "Export to PDF/CSV",
        "Custom branding"
      ],
      cta: "Start Pro Trial",
      href: "/signup?plan=pro",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For teams and organizations",
      features: [
        "Unlimited idea validations",
        "Custom AI models",
        "API access",
        "Team collaboration",
        "Dedicated account manager",
        "Custom integrations",
        "Training & onboarding",
        "SLA & support"
      ],
      cta: "Contact Sales",
      href: "/contact"
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
                  Simple, Transparent Pricing
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Choose the perfect plan for your idea validation needs
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 mt-12">
              {tiers.map((tier, index) => (
                <div
                  key={index}
                  className={`relative overflow-hidden rounded-lg border bg-background p-6 ${
                    tier.popular ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
                      Popular
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold">{tier.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">{tier.price}</span>
                      {tier.period && (
                        <span className="text-muted-foreground">/{tier.period}</span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {tier.description}
                    </p>
                  </div>
                  <ul className="mb-6 space-y-2">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <Check className="mr-2 h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href={tier.href} className="block">
                    <Button
                      className="w-full"
                      variant={tier.popular ? 'default' : 'outline'}
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </div>
              ))}
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