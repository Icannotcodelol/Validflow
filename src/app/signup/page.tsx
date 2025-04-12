"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/components/providers/SessionProvider";
import { useEffect } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const supabase = useSupabase();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/validate');
      }
    };
    checkSession();
  }, [supabase, router]);

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      console.error('Error signing up:', error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign up to validate your product idea
          </p>
        </div>

        <Button
          variant="outline"
          type="button"
          onClick={handleSignUp}
          className="w-full"
        >
          Continue with Google
        </Button>

        <p className="px-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button
            variant="link"
            className="p-0"
            onClick={() => router.push("/signin")}
          >
            Sign in
          </Button>
        </p>
      </div>
    </div>
  );
} 