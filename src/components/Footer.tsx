import Link from "next/link"

export function Footer() {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <p className="text-xs text-muted-foreground">© 2025 ValidFlow. All rights reserved.</p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link className="text-xs hover:underline underline-offset-4" href="/legal/terms-of-service">
          Terms of Service
        </Link>
        <Link className="text-xs hover:underline underline-offset-4" href="/legal/privacy-policy">
          Privacy
        </Link>
        <Link className="text-xs hover:underline underline-offset-4" href="/legal/cookie-policy">
          Cookies
        </Link>
        <Link className="text-xs hover:underline underline-offset-4" href="/legal/refund-policy">
          Refunds
        </Link>
        <Link className="text-xs hover:underline underline-offset-4" href="mailto:henkes2max@gmail.com">
          Contact Us
        </Link>
      </nav>
    </footer>
  )
} 