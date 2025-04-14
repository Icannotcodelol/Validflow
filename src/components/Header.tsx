"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b h-16">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="text-xl font-semibold"
        >
          ValidFlow
        </Button>
        {isAuthenticated ? (
          <nav className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard")}
            >
              Dashboard
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push("/validate")}
            >
              New Analysis
            </Button>
            <Button
              variant="ghost"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </nav>
        ) : (
          <nav className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/signin")}
            >
              Sign In
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
} 