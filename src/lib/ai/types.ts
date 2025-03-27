export interface UserInput {
  userId: string;
  description: string;
  industry: string;
  subIndustry: string;
  targetCustomers: string;
  pricingModel: string;
  currentStage: string;
  teamComposition: string;
  additionalInfo?: string;
}

export interface MarketSizeGrowth {
  status: 'completed' | 'failed';
  marketSize?: {
    total: string;
    addressable: string;
    obtainable: string;
    growth: string;
  };
  error?: string;
} 