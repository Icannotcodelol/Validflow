import { AnalysisResult } from "@/types/dashboard";

export const sampleAnalysisResult: AnalysisResult = {
  marketResearch: {
    status: 'completed',
    marketSize: {
      total: "$50B",
      addressable: "$10B",
      obtainable: "$500M",
      growth: "15% YoY"
    },
    demographics: {
      primarySegments: ["Elderly Patients", "Healthcare Providers", "Family Caregivers"],
      segmentDetails: [
        {
          name: "Elderly Patients",
          characteristics: ["65+ years", "Limited mobility", "Chronic conditions"],
          preferences: ["Convenience", "Quality care", "Affordability"],
          painPoints: ["Access to care", "Transportation", "Cost management"],
          acquisitionChannels: ["Healthcare providers", "Online advertising", "Family referrals"]
        }
      ]
    },
    vcActivity: {
      activeVCs: 150,
      totalInvestment: "$8.2B",
      averageDealSize: "$25M",
      notableDeals: [
        {
          investor: "Andreessen Horowitz",
          company: "HomeHealth AI",
          amount: "$120M",
          date: "Jan 2024"
        },
        {
          investor: "Sequoia Capital",
          company: "CareConnect",
          amount: "$85M",
          date: "Dec 2023"
        },
        {
          investor: "NEA",
          company: "ElderTech Solutions",
          amount: "$45M",
          date: "Nov 2023"
        }
      ]
    },
    trends: [
      {
        name: "Telehealth Integration",
        description: "Growing adoption of remote healthcare services",
        impact: "High",
        timeframe: "Ongoing",
        source: "Healthcare Industry Report 2023",
        opportunities: ["Market expansion", "Cost reduction"],
        threats: ["Regulatory changes", "Competition"]
      }
    ],
    competitors: [
      {
        name: "Competitor A",
        type: "Direct",
        marketShare: "15%",
        strengths: ["Brand recognition", "Large network"],
        weaknesses: ["High costs", "Limited personalization"],
        strategy: "Premium service model",
        pricing: "Subscription-based",
        differentiators: ["Established brand", "Wide coverage"]
      }
    ],
    regulations: [
      {
        type: "Healthcare",
        description: "HIPAA compliance requirements",
        impact: "High",
        compliance: "Mandatory",
        timeline: "Immediate",
        cost: "High",
        jurisdiction: "United States"
      }
    ],
    marketDynamics: {
      entryBarriers: [
        {
          barrier: "Regulatory Compliance",
          impact: "High",
          mitigation: "Partner with compliance experts"
        }
      ],
      supplierPower: "Medium - Healthcare providers have significant bargaining power",
      buyerPower: "Medium - Patients have multiple options",
      substitutes: ["Traditional home care services", "Family caregivers"],
      industryRivalry: "High - Competitive market with established players"
    }
  },
  analysis: {
    executiveSummary: {
      status: 'completed',
      title: "Healthcare Marketplace Platform",
      verdict: "Highly Promising",
      score: 85,
      summary: "A well-positioned solution addressing critical healthcare access challenges",
      keyFindings: [
        { type: "strength", text: "Strong market demand and growth potential" },
        { type: "warning", text: "Regulatory compliance requirements" }
      ]
    },
    detailedAnalysis: {
      status: 'completed',
      valueProposition: {
        uniqueness: "AI-powered matching system",
        sustainability: "Network effects",
        scalability: "Digital platform"
      },
      marketFit: {
        needAlignment: "High",
        timingAnalysis: "Optimal",
        competitiveAdvantage: "Technology-driven personalization",
        score: 85,
        marketSizeScore: 80
      },
      financialAnalysis: {
        revenueStreams: ["Platform fees", "Premium subscriptions"],
        costStructure: {
          fixed: ["Technology infrastructure", "Marketing"],
          variable: ["Customer support", "Provider verification"],
          unitEconomics: {
            cac: "$150",
            ltv: "$1200",
            margin: "70%",
            paybackPeriod: "6 months",
            breakEvenPoint: "1500 users"
          }
        },
        projections: {
          year1: "$5M revenue",
          year3: "$25M revenue",
          breakeven: "Month 18"
        },
        score: 75
      },
      riskAssessment: {
        marketRisks: [
          {
            risk: "Regulatory changes",
            likelihood: "Medium",
            impact: "High",
            mitigation: "Proactive compliance monitoring"
          }
        ],
        operationalRisks: [
          {
            risk: "Provider quality control",
            likelihood: "Medium",
            impact: "High",
            mitigation: "Strict verification process"
          }
        ],
        financialRisks: [
          {
            risk: "Extended runway needs",
            likelihood: "Medium",
            impact: "High",
            mitigation: "Conservative cash management"
          }
        ],
        riskScore: 70
      },
      implementationPlan: {
        phases: [
          {
            name: "MVP Launch",
            duration: "3 months",
            objectives: ["Basic matching", "Core features"],
            resources: ["Development team", "Marketing budget"],
            milestones: ["Beta launch", "First 100 providers"]
          }
        ],
        criticalPath: ["Platform development", "Provider onboarding"],
        keyMetrics: ["User acquisition", "Provider retention"],
        feasibilityScore: 80
      }
    }
  },
  content: {
    title: "Healthcare Marketplace Platform",
    verdict: "Highly Promising",
    score: 85,
    summary: "A well-positioned solution addressing critical healthcare access challenges",
    keyFindings: [
      { type: "strength", text: "Strong market demand and growth potential" },
      { type: "warning", text: "Regulatory compliance requirements" }
    ]
  },
  sections: {
    criticalThoughtQuestions: {
      status: 'completed',
      sectionId: 'critical-thought-questions',
      createdAt: new Date(),
      updatedAt: new Date(),
      questions: [
        {
          category: "Market Validation",
          question: "How does the solution address the core pain points of the target market?",
          priority: "high",
          analysis: "Placeholder analysis for market validation question 1.",
          implications: ["Placeholder implication 1"],
          recommendations: ["Placeholder recommendation 1"]
        },
        {
          category: "Market Validation",
          question: "What evidence supports the market size and growth projections?",
          priority: "high",
          analysis: "Placeholder analysis for market validation question 2.",
          implications: ["Placeholder implication 2"],
          recommendations: ["Placeholder recommendation 2"]
        },
        {
          category: "Competitive Analysis",
          question: "What are the key differentiators from existing solutions?",
          priority: "high",
          analysis: "Placeholder analysis for competitive analysis question 1.",
          implications: ["Placeholder implication 3"],
          recommendations: ["Placeholder recommendation 3"]
        },
        {
          category: "Competitive Analysis",
          question: "How sustainable are these competitive advantages?",
          priority: "medium",
          analysis: "Placeholder analysis for competitive analysis question 2.",
          implications: ["Placeholder implication 4"],
          recommendations: ["Placeholder recommendation 4"]
        },
        {
          category: "Business Model",
          question: "How scalable is the revenue model?",
          priority: "high",
          analysis: "Placeholder analysis for business model question 1.",
          implications: ["Placeholder implication 5"],
          recommendations: ["Placeholder recommendation 5"]
        },
        {
          category: "Business Model",
          question: "What are the key assumptions in the financial projections?",
          priority: "medium",
          analysis: "Placeholder analysis for business model question 2.",
          implications: ["Placeholder implication 6"],
          recommendations: ["Placeholder recommendation 6"]
        }
      ],
      riskAssessment: {
        highPriority: ["Placeholder high priority risk 1"],
        mediumPriority: ["Placeholder medium priority risk 1"],
        lowPriority: ["Placeholder low priority risk 1"]
      },
      actionItems: [
        {
          item: "Placeholder action item 1.",
          priority: "high",
          timeline: "Q1",
          owner: "CEO"
        },
        {
          item: "Placeholder action item 2.",
          priority: "medium",
          timeline: "Q2",
          owner: "CTO"
        }
      ]
    }
  }
}; 