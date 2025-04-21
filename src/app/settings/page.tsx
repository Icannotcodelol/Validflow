'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { SubscriptionManager } from '@/components/SubscriptionManager';
import { useRouter } from 'next/navigation';

interface UserCredits {
  has_unlimited: boolean;
  unlimited_until: string | null;
  credits: number;
}

export default function SettingsPage() {
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadUserData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/login');
          return;
        }

        const { data: credits, error } = await supabase
          .from('user_credits')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user credits:', error);
          return;
        }

        setUserCredits(credits);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, [router, supabase]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="mx-auto max-w-2xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <h1 className="text-3xl font-bold">Settings</h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">Subscription</h2>
            {userCredits && (
              <SubscriptionManager
                hasUnlimited={userCredits.has_unlimited}
                unlimitedUntil={userCredits.unlimited_until}
              />
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Credits</h2>
            <div className="rounded-lg border p-6">
              <p className="text-lg">
                Available Credits: <span className="font-semibold">{userCredits?.credits || 0}</span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 