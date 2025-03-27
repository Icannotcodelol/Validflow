"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const industryOptions = [
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "education", label: "Education" },
  { value: "retail", label: "Retail" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "services", label: "Services" },
  { value: "other", label: "Other" }
];

const subIndustryOptions = {
  technology: [
    { value: "software", label: "Software" },
    { value: "hardware", label: "Hardware" },
    { value: "ai-ml", label: "AI/ML" },
    { value: "cloud", label: "Cloud Computing" },
    { value: "cybersecurity", label: "Cybersecurity" },
    { value: "mobile", label: "Mobile Apps" },
    { value: "web", label: "Web Development" },
    { value: "iot", label: "Internet of Things" }
  ],
  healthcare: [
    { value: "telehealth", label: "Telehealth" },
    { value: "medical-devices", label: "Medical Devices" },
    { value: "health-insurance", label: "Health Insurance" },
    { value: "pharmaceuticals", label: "Pharmaceuticals" },
    { value: "wellness", label: "Wellness & Fitness" },
    { value: "mental-health", label: "Mental Health" }
  ],
  finance: [
    { value: "fintech", label: "FinTech" },
    { value: "banking", label: "Banking" },
    { value: "insurance", label: "Insurance" },
    { value: "investment", label: "Investment" },
    { value: "cryptocurrency", label: "Cryptocurrency" }
  ],
  education: [
    { value: "edtech", label: "EdTech" },
    { value: "online-learning", label: "Online Learning" },
    { value: "tutoring", label: "Tutoring" },
    { value: "corporate-training", label: "Corporate Training" }
  ],
  retail: [
    { value: "ecommerce", label: "E-commerce" },
    { value: "brick-mortar", label: "Brick & Mortar" },
    { value: "marketplace", label: "Marketplace" },
    { value: "subscription", label: "Subscription Box" }
  ],
  manufacturing: [
    { value: "automotive", label: "Automotive" },
    { value: "electronics", label: "Electronics" },
    { value: "textiles", label: "Textiles" },
    { value: "food-beverage", label: "Food & Beverage" }
  ],
  services: [
    { value: "consulting", label: "Consulting" },
    { value: "professional-services", label: "Professional Services" },
    { value: "personal-services", label: "Personal Services" },
    { value: "logistics", label: "Logistics" }
  ],
  other: [
    { value: "other", label: "Other" }
  ]
};

const targetCustomerOptions = [
  { value: "b2b", label: "Business to Business (B2B)" },
  { value: "b2c", label: "Business to Consumer (B2C)" },
  { value: "b2b2c", label: "Business to Business to Consumer (B2B2C)" },
  { value: "d2c", label: "Direct to Consumer (D2C)" }
];

const pricingModelOptions = [
  { value: "subscription", label: "Subscription" },
  { value: "one-time", label: "One-time Purchase" },
  { value: "freemium", label: "Freemium" },
  { value: "advertising", label: "Advertising-based" },
  { value: "marketplace", label: "Marketplace Commission" }
];

const currentStageOptions = [
  { value: "idea", label: "Idea Stage" },
  { value: "mvp", label: "MVP Development" },
  { value: "beta", label: "Beta Testing" },
  { value: "launched", label: "Launched" },
  { value: "scaling", label: "Scaling" }
];

const teamCompositionOptions = [
  { value: "solo-technical", label: "Solo Technical Founder" },
  { value: "solo-business", label: "Solo Business Founder" },
  { value: "technical-team", label: "Technical Team (2+ developers)" },
  { value: "mixed-team-small", label: "Mixed Team (2-3 people)" },
  { value: "mixed-team-medium", label: "Mixed Team (4-6 people)" },
  { value: "mixed-team-large", label: "Mixed Team (7+ people)" },
  { value: "business-team", label: "Business Team" },
  { value: "research-team", label: "Research/Academic Team" }
];

export default function ValidatePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    description: "",
    industry: "",
    subIndustry: "",
    targetCustomers: "",
    pricingModel: "",
    currentStage: "",
    teamComposition: "",
    additionalInfo: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!session?.user?.id) {
      setError("You must be signed in to submit an analysis");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: session.user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze idea');
      }

      const result = await response.json();
      router.push(`/analysis/${result.analysisId}`);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-white pt-36 pb-12">
      <div className="container mx-auto px-4">
        <div className="absolute top-8 left-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back to Home
          </Button>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Validate Your Product Idea</h1>
            <p className="text-gray-500 text-sm">
              Fill out the form below to get a comprehensive analysis of your product concept.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Description
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product idea in detail..."
                className="w-full"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <Select
                value={formData.industry}
                onValueChange={(value) => handleSelectChange("industry", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  {industryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!formData.industry && (
                <p className="mt-1 text-sm text-red-600">Please select an industry</p>
              )}
            </div>

            {formData.industry && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub-industry
                </label>
                <Select
                  value={formData.subIndustry}
                  onValueChange={(value) => handleSelectChange("subIndustry", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a sub-industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {subIndustryOptions[formData.industry as keyof typeof subIndustryOptions].map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!formData.subIndustry && (
                  <p className="mt-1 text-sm text-red-600">Please select a sub-industry</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Customers
              </label>
              <Select
                value={formData.targetCustomers}
                onValueChange={(value) => handleSelectChange("targetCustomers", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select target customers" />
                </SelectTrigger>
                <SelectContent>
                  {targetCustomerOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!formData.targetCustomers && (
                <p className="mt-1 text-sm text-red-600">Please select target customers</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pricing Model
              </label>
              <Select
                value={formData.pricingModel}
                onValueChange={(value) => handleSelectChange("pricingModel", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a pricing model" />
                </SelectTrigger>
                <SelectContent>
                  {pricingModelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!formData.pricingModel && (
                <p className="mt-1 text-sm text-red-600">Please select a pricing model</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Stage
              </label>
              <Select
                value={formData.currentStage}
                onValueChange={(value) => handleSelectChange("currentStage", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select current stage" />
                </SelectTrigger>
                <SelectContent>
                  {currentStageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!formData.currentStage && (
                <p className="mt-1 text-sm text-red-600">Please select current stage</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team Composition
              </label>
              <Select
                value={formData.teamComposition}
                onValueChange={(value) => handleSelectChange("teamComposition", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select team composition" />
                </SelectTrigger>
                <SelectContent>
                  {teamCompositionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!formData.teamComposition && (
                <p className="mt-1 text-sm text-red-600">Please select team composition</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Information
              </label>
              <Textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Any additional information that might be relevant..."
                className="w-full"
                rows={3}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Analyzing..." : "Start Analysis"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 