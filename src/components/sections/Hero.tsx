import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TypingAnimation } from '@/components/typing-animation';

const validationIdeas = [
  "marketing strategy",
  "product-market fit",
  "go-to-market plan",
  "growth strategy",
  "market positioning",
  "target audience",
];

interface HeroProps {
  onTryValidFlow: () => void;
  isLoading: boolean;
}

export function Hero({ onTryValidFlow, isLoading }: HeroProps) {
  return (
    <section 
      className="w-full min-h-[80vh] relative flex items-center py-12 md:py-24 lg:py-32 xl:py-48 bg-cover bg-center bg-no-repeat overflow-hidden" 
      style={{ 
        backgroundImage: "url('/images/hero-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80"></div>
      <div className="container relative pl-8 md:pl-12 pr-4 md:pr-6 z-10">
        <div className="max-w-3xl">
          <div className="relative">
            <div className="space-y-8">
              <div className="h-[180px] sm:h-[200px] flex items-center">
                <TypingAnimation
                  ideas={validationIdeas}
                  className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                  staticText="validate my"
                  typingSpeed={100}
                  deleteSpeed={50}
                  pauseDuration={2000}
                />
              </div>
              <p className="max-w-[600px] text-white/90 md:text-xl text-left">
                Take the guesswork out of your startup idea. Get instant market validation and competitor insights that usually take months to gather. Start your journey with confidence, not speculation.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row mt-8">
            <Button 
              size="lg" 
              className="gap-1 bg-black hover:bg-black/90"
              onClick={onTryValidFlow}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Try It Now"} {!isLoading && <ArrowRight className="h-4 w-4" />}
            </Button>
            <Link href="/examples" className="inline-flex">
              <Button variant="outline" size="lg" className="bg-black hover:bg-black/90 text-white border-white/20">
                See Example Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 