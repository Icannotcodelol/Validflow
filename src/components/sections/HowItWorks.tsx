import React from 'react';
import Link from 'next/link';
import { Lightbulb, Target, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const steps = [
  {
    icon: Lightbulb,
    title: "Share Your Vision",
    description: "Tell us about your product concept, target market, and business model. Our AI-powered platform asks the right questions to understand your unique value proposition, market positioning, and growth potential. We analyze every aspect of your idea to ensure nothing is overlooked.",
    details: [
      "Structured questionnaire covering all critical business aspects",
      "AI-guided process that adapts to your responses",
      "Comprehensive data collection for thorough analysis"
    ]
  },
  {
    icon: Target,
    title: "Deep Market Analysis",
    description: "Our advanced AI analyzes your idea across multiple dimensions using real-time market data, competitor intelligence, and industry trends. We leverage multiple AI models to provide the most accurate and comprehensive analysis possible.",
    details: [
      "Market size & growth potential analysis",
      "Competitive landscape mapping",
      "Target user segmentation & validation",
      "Revenue model assessment",
      "Risk analysis & mitigation strategies",
      "Marketing channel effectiveness",
      "Unit economics breakdown",
      "Investment attractiveness scoring"
    ]
  },
  {
    icon: CheckCircle,
    title: "Strategic Roadmap",
    description: "Receive a detailed, actionable validation report that goes beyond simple insights. Get specific, data-backed recommendations for your go-to-market strategy, including revenue projections, growth tactics, and critical success metrics.",
    details: [
      "Step-by-step implementation plan",
      "Revenue & growth projections",
      "Key performance indicators (KPIs)",
      "Critical validation experiments",
      "Resource requirements & timeline",
      "Risk mitigation strategies"
    ]
  }
];

const faqs = [
  {
    question: "How long does the validation process take?",
    answer: "Our AI-powered analysis provides results in minutes, not weeks. The initial analysis is completed within 5-10 minutes of submitting your information. This includes a comprehensive validation report covering market analysis, competitor insights, and strategic recommendations. While traditional validation might take months and cost thousands, our AI technology delivers instant, data-driven insights to help you move faster."
  },
  {
    question: "What kind of insights will I receive?",
    answer: "Our comprehensive analysis covers 13 critical business dimensions: 1) Market Size & Growth Analysis with TAM, SAM, and SOM calculations, 2) Detailed Competitor Landscape with positioning maps, 3) Target User Segmentation with detailed personas, 4) Unit Economics & Pricing Strategy, 5) Marketing Channel Analysis, 6) Go-to-Market Strategy, 7) VC Sentiment Analysis, 8) Critical Success Factors, 9) Validation Roadmap, 10) Key Performance Indicators, 11) Experiment Design, 12) Risk Assessment, and 13) Executive Summary with clear recommendations. Each section provides actionable insights backed by current market data."
  },
  {
    question: "How accurate is the analysis?",
    answer: "Our platform combines multiple state-of-the-art AI models (including Claude-3, GPT-4, and Perplexity) to provide highly accurate insights. Each model specializes in different aspects of the analysis, and we cross-validate findings across models. Our AI is trained on extensive market data, updated daily with the latest industry trends, and validated against real-world business outcomes. While no prediction is 100% certain, our multi-model approach provides robust, data-backed insights that have helped thousands of entrepreneurs make better decisions."
  },
  {
    question: "Can I validate multiple ideas?",
    answer: "Yes! You can validate as many ideas as you'd like. Each validation uses one credit from your account. This allows you to test different variations of your idea or compare multiple business concepts. Many successful entrepreneurs use our platform to validate several ideas before choosing the most promising one to pursue. We also offer unlimited plans for those who need to validate ideas regularly."
  }
];

export function HowItWorks() {
  return (
    <div className="w-full py-16 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        {/* How It Works Section */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <div className="space-y-2 max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Transform your business idea into a validated strategy with our AI-powered analysis platform. Get comprehensive market insights, competitive analysis, and actionable recommendations in minutes, not months.
            </p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              <ul className="text-sm text-muted-foreground text-left space-y-2 mt-4">
                {step.details.map((detail, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-1" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Pricing Preview */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <div className="space-y-2 max-w-3xl">
            <h2 className="text-2xl font-bold">Start Validating Today</h2>
            <p className="text-muted-foreground">
              Choose a plan that works for you and start making data-driven decisions about your business ideas
            </p>
          </div>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/pricing">
                View Pricing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
} 