"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/providers/SessionProvider";
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
import { User } from '@supabase/supabase-js';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";

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

const formSchema = z.object({
  productDescription: z.string().min(10, "Product description must be at least 10 characters"),
  industry: z.string({ required_error: "Please select an industry" }),
  subIndustry: z.string({ required_error: "Please select a sub-industry" }),
  targetCustomers: z.string({ required_error: "Please select target customers" }),
  pricingModel: z.string({ required_error: "Please select a pricing model" }),
  currentStage: z.string({ required_error: "Please select current stage" }),
  teamComposition: z.string({ required_error: "Please select team composition" }),
  additionalInfo: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

type FormFields = "productDescription" | "industry" | "subIndustry" | "targetCustomers" | 
                 "pricingModel" | "currentStage" | "teamComposition" | "additionalInfo";

export default function ValidatePage() {
  const router = useRouter();
  const supabase = useSupabase();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userCredits, setUserCredits] = useState<{
    credits_balance: number;
    has_unlimited: boolean;
    unlimited_until: string | null;
    free_analysis_used: boolean;
  } | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [hasUnlimitedAccess, setHasUnlimitedAccess] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productDescription: "",
      industry: "",
      subIndustry: "",
      targetCustomers: "",
      pricingModel: "",
      currentStage: "",
      teamComposition: "",
      additionalInfo: "",
    },
  });

  useEffect(() => {
    const checkUser = async () => {
      console.log('[ValidatePage useEffect] Running checkUser...');
      setLoading(true); // Ensure loading is true at the start
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('[ValidatePage useEffect] Error getting session:', sessionError);
        // Decide how to handle session errors, maybe redirect?
        setLoading(false);
        router.push("/signin?error=session_error"); // Example redirect
        return; 
      }

      console.log('[ValidatePage useEffect] Session data:', session);

      if (!session) {
        console.log('[ValidatePage useEffect] No session found, redirecting to signin.');
        setLoading(false); // Set loading false before redirect
        router.push("/signin");
      } else {
        console.log(`[ValidatePage useEffect] Session found for user: ${session.user.id}. Fetching credits...`);
        setUser(session.user);
        
        try {
          // Fetch user credits
          const { data: credits, error: creditsError } = await supabase
            .from('user_credits')
            .select('credits_balance, has_unlimited, unlimited_until, free_analysis_used')
            .eq('user_id', session.user.id)
            .single();

          console.log('[ValidatePage useEffect] Fetched credits data:', credits);
          console.log('[ValidatePage useEffect] Credits fetch error:', creditsError);

          if (creditsError && creditsError.code !== 'PGRST116') {
            // Handle unexpected errors during fetch
            console.error('[ValidatePage useEffect] Unexpected error fetching credits:', creditsError);
            setError(`Error fetching user data: ${creditsError.message}`);
            // Don't set userCredits if fetch failed unexpectedly
          } else if (creditsError && creditsError.code === 'PGRST116') {
            // No record exists, create one
            console.log('[ValidatePage useEffect] No credits record found, creating one...');
            const { data: newCredits, error: insertError } = await supabase
              .from('user_credits')
              .insert({
                user_id: session.user.id,
                credits_balance: 0, // Start with 0 credits
                has_unlimited: false,
                free_analysis_used: false // Ensure this is set
              })
              .select('credits_balance, has_unlimited, unlimited_until, free_analysis_used') // Select the fields needed
              .single();

            if (insertError) {
              console.error('[ValidatePage useEffect] Error inserting credits record:', insertError);
              setError(`Error setting up user account: ${insertError.message}`);
            } else if (newCredits) {
              console.log('[ValidatePage useEffect] Credits record created successfully:', newCredits);
              setUserCredits(newCredits);
            } else {
               console.warn('[ValidatePage useEffect] Insert call completed but returned no data.');
               setError('Failed to initialize user account.');
            }
          } else if (credits) {
            // Record found and fetched successfully
            console.log('[ValidatePage useEffect] Credits record found:', credits);
            setUserCredits(credits);
          }
        } catch (fetchCatchError: any) {
           console.error('[ValidatePage useEffect] Caught exception during credits fetch/insert:', fetchCatchError);
           setError(`An unexpected error occurred: ${fetchCatchError.message}`);
        } finally {
           console.log('[ValidatePage useEffect] Setting loading to false.');
           setLoading(false); // Ensure loading is set to false after all paths
        }
      }
      // setLoading(false); // Moved inside the else block and finally block
    };

    checkUser();
  }, [supabase, router]);

  useEffect(() => {
    const checkCredits = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/credits/check");
          const data = await response.json();
          setCredits(data.credits);
          setHasUnlimitedAccess(data.hasUnlimitedAccess);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to fetch credits. Please try again later.",
            variant: "destructive",
          });
        }
      }
    };

    checkCredits();
  }, [session]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Router will redirect to signin
  }

  const handleNeedCredits = () => {
    router.push('/pricing');
  };

  const onSubmit = async (data: FormData) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to use this feature.",
        variant: "destructive",
      });
      router.push("/auth/signin");
      return;
    }

    if (!hasUnlimitedAccess && (!credits || credits <= 0)) {
      toast({
        title: "Insufficient credits",
        description: "Please purchase more credits to continue.",
        variant: "destructive",
      });
      router.push("/pricing");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit analysis");
      }

      const result = await response.json();
      router.push(`/results/${result.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    form.setValue(name as FormFields, value);
  };

  const handleSelectChange = (name: FormFields, value: string) => {
    form.setValue(name, value);
  };

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

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
            <p className="text-gray-500 text-sm mb-4">
              Fill out the form below to get a comprehensive analysis of your product concept.
            </p>
            {userCredits && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md inline-block">
                {userCredits.has_unlimited ? (
                  <span className="font-medium text-green-600">
                    Unlimited Access Active
                    {userCredits.unlimited_until && 
                      ` (until ${new Date(userCredits.unlimited_until).toLocaleDateString()})`}
                  </span>
                ) : (
                  <span>
                    {userCredits.credits_balance === 0 && !userCredits.free_analysis_used ? (
                      <span className="text-blue-600">Free Analysis Available</span>
                    ) : (
                      <span>Credits Remaining: <span className="font-medium">{userCredits.credits_balance}</span></span>
                    )}
                  </span>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Product Description
              </label>
              <Textarea
                id="productDescription"
                aria-label="Product Description"
                {...form.register("productDescription")}
                placeholder="Describe your product idea..."
                className="w-full"
                rows={4}
              />
              {form.formState.errors.productDescription && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.productDescription.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <Select
                onValueChange={(value) => handleSelectChange("industry", value)}
                value={form.watch("industry")}
              >
                <SelectTrigger id="industry" className="w-full">
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
              {form.formState.errors.industry && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.industry.message}</p>
              )}
            </div>

            {form.watch("industry") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub-industry
                </label>
                <Select
                  value={form.watch("subIndustry")}
                  onValueChange={(value) => handleSelectChange("subIndustry", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a sub-industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {subIndustryOptions[form.watch("industry") as keyof typeof subIndustryOptions].map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.subIndustry && (
                  <p className="mt-1 text-sm text-red-600">{form.formState.errors.subIndustry.message}</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="targetCustomers" className="block text-sm font-medium text-gray-700 mb-1">
                Target Customers
              </label>
              <Select
                onValueChange={(value) => handleSelectChange("targetCustomers", value)}
                value={form.watch("targetCustomers")}
              >
                <SelectTrigger id="targetCustomers" className="w-full">
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
              {form.formState.errors.targetCustomers && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.targetCustomers.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="pricingModel" className="block text-sm font-medium text-gray-700 mb-1">
                Pricing Model
              </label>
              <Select
                onValueChange={(value) => handleSelectChange("pricingModel", value)}
                value={form.watch("pricingModel")}
              >
                <SelectTrigger id="pricingModel" className="w-full">
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
              {form.formState.errors.pricingModel && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.pricingModel.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="currentStage" className="block text-sm font-medium text-gray-700 mb-1">
                Current Stage
              </label>
              <Select
                onValueChange={(value) => handleSelectChange("currentStage", value)}
                value={form.watch("currentStage")}
              >
                <SelectTrigger id="currentStage" className="w-full">
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
              {form.formState.errors.currentStage && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.currentStage.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="teamComposition" className="block text-sm font-medium text-gray-700 mb-1">
                Team Composition
              </label>
              <Select
                onValueChange={(value) => handleSelectChange("teamComposition", value)}
                value={form.watch("teamComposition")}
              >
                <SelectTrigger id="teamComposition" className="w-full">
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
              {form.formState.errors.teamComposition && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.teamComposition.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Information
              </label>
              <Textarea
                id="additionalInfo"
                aria-label="Additional Information"
                {...form.register("additionalInfo")}
                placeholder="Any additional information that might be relevant..."
                className="w-full"
                rows={3}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              aria-label={isLoading ? "Analyzing..." : "Start Analysis"}
            >
              {isLoading ? "Analyzing..." : "Start Analysis"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 