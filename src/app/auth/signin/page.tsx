"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/components/providers/SessionProvider";

export default function SignInPage() {
  const router = useRouter();
  const supabase = useSupabase();

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      console.error('Error signing in:', error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to validate your product idea
          </p>
        </div>

        <Button
          variant="outline"
          type="button"
          onClick={handleSignIn}
          className="w-full"
        >
          Continue with Google
        </Button>
      </div>
    </div>
  );
} 