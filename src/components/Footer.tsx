import Link from "next/link"
import { Lightbulb } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 lg:gap-12">
          {/* Brand and Description */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">ValidFlow</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              AI-powered business idea validation platform helping entrepreneurs make data-driven decisions.
            </p>
          </div>

          {/* Product Links */}
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-3">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/features">
                  Features
                </Link>
              </li>
              <li>
                <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/pricing">
                  Pricing
                </Link>
              </li>
              <li>
                <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/examples">
                  Examples
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/about">
                  About
                </Link>
              </li>
              <li>
                <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="mailto:henkes2max@gmail.com">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/legal/terms-of-service">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/legal/privacy-policy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/legal/cookie-policy">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/legal/refund-policy">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Started */}
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-3">Get Started</h3>
            <ul className="space-y-2">
              <li>
                <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/signin">
                  Sign In
                </Link>
              </li>
              <li>
                <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/signup">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/validate">
                  Try Now
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              © 2025 ValidFlow. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 