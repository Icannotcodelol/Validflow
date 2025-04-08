"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/components/providers/SessionProvider";
import { Button } from "@/components/ui/button";

export default function TestConnection() {
  const supabase = useSupabase();
  const [status, setStatus] = useState<string>("Testing connection...");
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Test database connection with a simpler query first
        const { data, error: dbError } = await supabase
          .from('user_credits')
          .select('count')
          .limit(1);
        
        if (dbError) {
          console.error('Database connection error:', dbError);
          throw new Error('Failed to connect to database');
        }
        
        // Test auth connection
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (authError) {
          console.error('Auth connection error:', authError);
          throw new Error('Failed to check authentication');
        }

        setUser(session?.user);
        setStatus("✅ Connection successful!");
        setError(null);
      } catch (error) {
        console.error("Connection error:", error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        setStatus("❌ Connection failed");
      }
    };

    checkConnection();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/validate`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) throw error;
    } catch (error) {
      console.error("Sign in error:", error);
      setError(error instanceof Error ? error.message : 'Failed to sign in');
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="text-sm">
        <p>Status: {status}</p>
        {error && (
          <p className="text-red-500 mt-1">{error}</p>
        )}
        {user && (
          <p className="mt-1">Logged in as: {user.email}</p>
        )}
      </div>
      {!user && (
        <Button onClick={handleSignIn}>
          Test Google Sign In
        </Button>
      )}
      {user && (
        <Button onClick={() => supabase.auth.signOut()}>
          Sign Out
        </Button>
      )}
    </div>
  );
} 