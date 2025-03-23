"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const industries = {
  "SaaS": ["CRM", "Project Management", "Marketing Automation", "HR / Payroll"],
  "Healthcare": ["Digital Health", "Telemedicine", "Elderly Care", "Medical Devices"],
  "Fintech": ["Personal Finance", "Payments", "Crypto / Web3", "Lending / Credit"],
  "EdTech": ["K-12", "Higher Education", "Microlearning", "Test Prep"],
  "E-commerce": ["Marketplaces", "DTC Brands", "Subscription Boxes", "Resale Platforms"],
  "Sustainability": ["Climate Tech", "Carbon Tracking", "Recycling & Waste", "Green Energy"],
  "Productivity": ["Note-Taking", "Task Management", "Time Tracking", "Collaboration Tools"],
  "Developer Tools": ["APIs / SDKs", "DevOps / CI", "Testing / QA", "Documentation Tools"],
  "AI / ML": ["Generative AI", "Computer Vision", "NLP / Chatbots", "Predictive Analytics"],
  "Other": ["General Tech", "Non-Tech"],
};

const pricingModels = [
  "Freemium",
  "Subscription (Monthly/Yearly)",
  "One-Time Payment",
  "Transaction Fee",
  "Pay-As-You-Go",
  "Licensing",
  "Ad-Supported",
];

const currentStages = [
  "Just an idea",
  "Wireframes done",
  "MVP in progress",
  "MVP launched",
  "Live product with users",
];

const teamCompositions = [
  "Solo founder",
  "2–3 person team",
  "4–6 person team",
  "7+ people",
];

export default function ValidatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    productDescription: "",
    industry: "",
    subIndustry: "",
    targetCustomers: "",
    pricingModel: "",
    currentStage: "",
    teamComposition: "",
    additionalInfo: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement API call to submit form data
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated API call
      router.push("/analysis");
    } catch (error) {
      console.error("Error submitting form:", error);
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

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="productDescription" className="text-sm font-medium text-gray-900">Product Description</Label>
                <Textarea
                  id="productDescription"
                  name="productDescription"
                  placeholder="Describe your product idea in detail. What problem does it solve? How does it work? What makes it unique?"
                  className="min-h-[100px] bg-white border-gray-200 focus:border-gray-400 text-sm"
                  required
                  value={formData.productDescription}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-sm font-medium text-gray-900">Industry</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, industry: value }))
                    }
                  >
                    <SelectTrigger className="h-12 bg-white border-gray-200 focus:border-gray-400 text-sm">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(industries).map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subIndustry" className="text-sm font-medium text-gray-900">Sub-industry</Label>
                  <Select
                    value={formData.subIndustry}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, subIndustry: value }))
                    }
                    disabled={!formData.industry}
                  >
                    <SelectTrigger className="h-12 bg-white border-gray-200 focus:border-gray-400 text-sm">
                      <SelectValue placeholder="Select sub-industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.industry &&
                        industries[formData.industry as keyof typeof industries].map(
                          (subIndustry) => (
                            <SelectItem key={subIndustry} value={subIndustry}>
                              {subIndustry}
                            </SelectItem>
                          )
                        )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetCustomers" className="text-sm font-medium text-gray-900">Target Customers</Label>
                <Input
                  id="targetCustomers"
                  name="targetCustomers"
                  placeholder="Describe your target customer segments"
                  className="h-12 bg-white border-gray-200 focus:border-gray-400 text-sm"
                  required
                  value={formData.targetCustomers}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pricingModel" className="text-sm font-medium text-gray-900">Pricing Model</Label>
                  <Select
                    value={formData.pricingModel}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, pricingModel: value }))
                    }
                  >
                    <SelectTrigger className="h-12 bg-white border-gray-200 focus:border-gray-400 text-sm">
                      <SelectValue placeholder="Select pricing model" />
                    </SelectTrigger>
                    <SelectContent>
                      {pricingModels.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentStage" className="text-sm font-medium text-gray-900">Current Stage</Label>
                  <Select
                    value={formData.currentStage}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, currentStage: value }))
                    }
                  >
                    <SelectTrigger className="h-12 bg-white border-gray-200 focus:border-gray-400 text-sm">
                      <SelectValue placeholder="Select current stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentStages.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamComposition" className="text-sm font-medium text-gray-900">Team Composition</Label>
                <Select
                  value={formData.teamComposition}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, teamComposition: value }))
                  }
                >
                  <SelectTrigger className="h-12 bg-white border-gray-200 focus:border-gray-400 text-sm">
                    <SelectValue placeholder="Select team composition" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamCompositions.map((composition) => (
                      <SelectItem key={composition} value={composition}>
                        {composition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo" className="text-sm font-medium text-gray-900">Additional Information (Optional)</Label>
                <Textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  placeholder="Any additional information you'd like to share..."
                  className="min-h-[80px] bg-white border-gray-200 focus:border-gray-400 text-sm"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                />
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  className="px-6 py-3 bg-black text-white rounded-md font-semibold hover:bg-gray-800 text-sm"
                  disabled={isLoading}
                >
                  {isLoading ? "Analyzing your idea..." : "Start Analysis"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 