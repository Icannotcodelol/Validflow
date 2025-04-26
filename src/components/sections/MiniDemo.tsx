"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DemoResults {
  marketSize: string;
  competition: string;
  targetUsers: string;
  recommendation: string;
}

export function MiniDemo() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoData, setDemoData] = useState({
    productName: '',
    description: '',
    targetMarket: ''
  });
  const [results, setResults] = useState<DemoResults | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDemoData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      console.log('Starting analysis with data:', demoData);
      setLoading(true);
      setError(null);
      try {
        console.log('Making API request...');
        const response = await fetch('/api/mini-demo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(demoData),
        });

        console.log('API response status:', response.status);
        const data = await response.json();
        console.log('API response data:', data);

        if (!response.ok) {
          // Handle structured error response
          if (data.error && data.details) {
            throw new Error(`${data.error}: ${data.details}`);
          } else if (data.error) {
            throw new Error(data.error);
          } else if (data.errors && Array.isArray(data.errors)) {
            throw new Error(data.errors.join('. '));
          } else {
            throw new Error('Failed to analyze business idea');
          }
        }

        // Validate required fields in the response
        const requiredFields = ['marketSize', 'competition', 'targetUsers', 'recommendation'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
          throw new Error(`Invalid response: Missing ${missingFields.join(', ')}`);
        }

        setResults(data);
      } catch (err) {
        console.error('Error during analysis:', err);
        setError(err instanceof Error ? err.message : 'Something went wrong during analysis');
      } finally {
        setLoading(false);
      }
    }
  };

  const isStepComplete = () => {
    switch (step) {
      case 1:
        return demoData.productName.length > 0;
      case 2:
        return demoData.description.length > 0;
      case 3:
        return demoData.targetMarket.length > 0;
      default:
        return false;
    }
  };

  const resetDemo = () => {
    setStep(1);
    setResults(null);
    setError(null);
    setDemoData({
      productName: '',
      description: '',
      targetMarket: ''
    });
  };

  if (results) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Quick Analysis Results</CardTitle>
            <CardDescription>Here's what our AI found about your idea</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Market Size</h4>
                  <p className="text-sm text-muted-foreground">{results.marketSize}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Competition</h4>
                  <p className="text-sm text-muted-foreground">{results.competition}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Target Users</h4>
                  <p className="text-sm text-muted-foreground">{results.targetUsers}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Recommendation</h4>
                  <p className="text-sm text-muted-foreground">{results.recommendation}</p>
                </div>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <div className="border-t pt-4">
                <h4 className="font-semibold text-lg mb-2">Want More? Get a Full Analysis!</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  This is just a quick demo. Our full analysis includes 13 comprehensive sections:
                </p>
                <div className="grid gap-3">
                  <div className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm text-blue-700">1</span>
                    </div>
                    <div>
                      <h5 className="font-medium">Executive Summary</h5>
                      <p className="text-sm text-muted-foreground">Complete overview with SWOT analysis and validation verdict</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm text-blue-700">2</span>
                    </div>
                    <div>
                      <h5 className="font-medium">Market Analysis</h5>
                      <p className="text-sm text-muted-foreground">TAM, SAM, SOM calculations with growth projections</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm text-blue-700">3</span>
                    </div>
                    <div>
                      <h5 className="font-medium">Target Users & Competition</h5>
                      <p className="text-sm text-muted-foreground">Detailed user personas and competitive landscape analysis</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm text-blue-700">4</span>
                    </div>
                    <div>
                      <h5 className="font-medium">Business Model</h5>
                      <p className="text-sm text-muted-foreground">Unit economics, marketing channels, and go-to-market strategy</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm text-blue-700">5</span>
                    </div>
                    <div>
                      <h5 className="font-medium">Validation Roadmap</h5>
                      <p className="text-sm text-muted-foreground">Critical questions, KPIs, and experiment design for validation</p>
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full mt-6"
                  variant="outline"
                  onClick={() => window.location.href = '/examples'}
                >
                  Check out a full analysis
                </Button>
                <Button
                  className="w-full mt-2"
                  variant="default"
                  onClick={() => window.location.href = '/validate'}
                >
                  Get Full Analysis
                </Button>
              </div>
              <Button
                className="w-full"
                variant="outline"
                onClick={resetDemo}
              >
                Try Another Idea
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Try It Out</CardTitle>
          <CardDescription>See how our validation process works with this quick demo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {step === 1 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">What's your product called?</label>
                <Input
                  placeholder="e.g., TaskFlow"
                  name="productName"
                  value={demoData.productName}
                  onChange={handleInputChange}
                />
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Briefly describe your product</label>
                <Textarea
                  placeholder="e.g., A productivity tool that helps teams collaborate better"
                  name="description"
                  value={demoData.description}
                  onChange={handleInputChange}
                />
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Who's your target market?</label>
                <Input
                  placeholder="e.g., Small business teams"
                  name="targetMarket"
                  value={demoData.targetMarket}
                  onChange={handleInputChange}
                />
              </div>
            )}
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                Step {step} of 3
              </div>
              <Button
                onClick={handleNext}
                disabled={!isStepComplete() || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing
                  </>
                ) : (
                  <>
                    {step === 3 ? 'Analyze' : 'Next'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 