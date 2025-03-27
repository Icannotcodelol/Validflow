import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AuthError({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = searchParams?.error || "An error occurred during authentication";

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center space-y-4 text-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Authentication Error
          </h1>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Link
            href="/auth/signin"
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            Back to Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
} 