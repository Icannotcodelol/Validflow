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
          unitEconomics: "Positive unit economics after 6 months"
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
          questions: [
            {
              question: "How does the solution address the core pain points of the target market?",
              importance: "high",
              context: "Understanding the alignment between solution and market needs"
            },
            {
              question: "What evidence supports the market size and growth projections?",
              importance: "high",
              context: "Validating market opportunity assumptions"
            }
          ]
        },
        {
          category: "Competitive Analysis",
          questions: [
            {
              question: "What are the key differentiators from existing solutions?",
              importance: "high",
              context: "Understanding unique value proposition"
            },
            {
              question: "How sustainable are these competitive advantages?",
              importance: "medium",
              context: "Evaluating long-term defensibility"
            }
          ]
        },
        {
          category: "Business Model",
          questions: [
            {
              question: "How scalable is the revenue model?",
              importance: "high",
              context: "Assessing growth potential and unit economics"
            },
            {
              question: "What are the key assumptions in the financial projections?",
              importance: "medium",
              context: "Validating financial planning"
            }
          ]
        }
      ]
    }
  }
}; 