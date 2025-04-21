'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/hooks/use-toast';

interface SubscriptionManagerProps {
  hasUnlimited: boolean;
  unlimitedUntil: string | null;
}

export function SubscriptionManager({ hasUnlimited, unlimitedUntil }: SubscriptionManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCancelSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel subscription');
      }

      // Close the dialog and show a success message
      setIsDialogOpen(false);
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription will remain active until the end of the billing period.",
      });
      
      // Refresh the page to update the UI
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to cancel subscription',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasUnlimited) {
    return null;
  }

  const formattedDate = unlimitedUntil 
    ? new Date(unlimitedUntil).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="rounded-lg border p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">Unlimited Subscription</h3>
          {formattedDate && (
            <p className="text-sm text-gray-500">
              Active until {formattedDate}
            </p>
          )}
        </div>
        <Button
          variant="destructive"
          onClick={() => setIsDialogOpen(true)}
          disabled={isLoading}
        >
          Cancel Subscription
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? You'll continue to have access until {formattedDate}.
              After that, you'll need to purchase credits or start a new subscription to continue using ValiNow.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="text-sm text-red-500 mt-2">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={isLoading}
            >
              {isLoading ? 'Cancelling...' : 'Yes, Cancel Subscription'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 