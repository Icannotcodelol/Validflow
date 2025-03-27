"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/validate" });
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome to ValiNow</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to start validating your business ideas
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <Button
            onClick={handleSignIn}
            className="w-full"
            variant="outline"
          >
            Continue with Google
          </Button>
          <Button
            onClick={() => router.push("/")}
            className="w-full"
            variant="ghost"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
} 