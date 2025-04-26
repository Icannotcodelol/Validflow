"use client"

import React from 'react';
import { ExampleValidation } from '@/components/ExampleValidation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ExamplesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Example Analysis</h1>
        <p className="text-lg text-muted-foreground mb-6">
          See how ValiNow analyzes and validates your marketing strategy. This example demonstrates our comprehensive validation process and the insights you can expect.
        </p>
        
        <div className="flex flex-col gap-4 mb-8">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">What you&apos;ll see in this example:</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Detailed market analysis and validation</li>
              <li>Key performance indicators and metrics</li>
              <li>Strategic recommendations</li>
              <li>Implementation timeline</li>
            </ul>
          </div>
        </div>
      </div>

      <ExampleValidation />
    </div>
  );
} 