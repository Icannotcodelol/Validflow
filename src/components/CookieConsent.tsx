'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      necessary: true,
      analytics: true,
      date: new Date().toISOString()
    }));
    setShowBanner(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      necessary: true,
      analytics: false,
      date: new Date().toISOString()
    }));
    setShowBanner(false);
  };

  const handleCustomize = () => {
    setShowDialog(true);
  };

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
        <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600">
              We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.{' '}
              <Link href="/legal/cookie-policy" className="text-primary hover:underline">
                Learn more
              </Link>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" onClick={handleCustomize}>
              Customize
            </Button>
            <Button variant="outline" size="sm" onClick={handleAcceptNecessary}>
              Accept Necessary
            </Button>
            <Button size="sm" onClick={handleAcceptAll}>
              Accept All
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cookie Preferences</DialogTitle>
            <DialogDescription>
              Customize your cookie preferences. Some cookies are necessary for the website to function and cannot be disabled.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-start space-x-4">
              <div>
                <h4 className="text-sm font-medium">Strictly Necessary</h4>
                <p className="text-sm text-muted-foreground">
                  These cookies are essential for the website to function properly.
                </p>
              </div>
              <input type="checkbox" checked disabled className="mt-1" />
            </div>

            <div className="flex items-start space-x-4">
              <div>
                <h4 className="text-sm font-medium">Analytics</h4>
                <p className="text-sm text-muted-foreground">
                  Help us improve by tracking anonymous usage data.
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                onChange={(e) => {
                  localStorage.setItem('cookieConsent', JSON.stringify({
                    necessary: true,
                    analytics: e.target.checked,
                    date: new Date().toISOString()
                  }));
                }}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Save Preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 