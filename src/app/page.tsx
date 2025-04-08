"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, BarChart3, CheckCircle, ChevronRight, Lightbulb, Target } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TypingAnimation } from "@/components/typing-animation"
import { productIdeas } from "@/lib/product-ideas"
import { AnalysisDisplay } from "@/components/AnalysisDisplay"

interface Detail {
  title: string
  content: string
}

interface Dimension {
  name: string
  score: number
  description: string
  details: Detail[]
}

const sampleAnalysis = {
  id: "sample-analysis",
  status: "completed",
  createdAt: new Date(),
  updatedAt: new Date(),
  sections: {
    executiveSummary: {
      status: "completed",
      sectionId: "executiveSummary",
      createdAt: new Date(),
      updatedAt: new Date(),
      data: {
        project: "MicroMeal: Meal Planning & Grocery Delivery Platform",
        score: 82,
        verdict: "Positive",
        summary: "MicroMeal presents a compelling opportunity in the growing meal planning and grocery delivery market. The platform addresses clear pain points for busy professionals while leveraging multiple revenue streams. With strong unit economics and a clear path to profitability, the concept shows promise but faces competition from established players.",
        keyFindings: [
          {
            type: "strength",
            text: "Unique value proposition of AI-powered meal planning with integrated grocery delivery"
          },
          {
            type: "strength",
            text: "Strong multi-revenue business model with subscription and commission streams"
          },
          {
            type: "strength",
            text: "Clear product differentiation with personalization and waste reduction features"
          },
          {
            type: "weakness",
            text: "Building a comprehensive grocery delivery network requires significant resources"
          },
          {
            type: "weakness",
            text: "Ensuring consistent service quality across delivery partners may be challenging"
          },
          {
            type: "opportunity",
            text: "Growing market demand for convenient, healthy meal solutions"
          },
          {
            type: "opportunity",
            text: "Potential for expansion into corporate wellness programs"
          },
          {
            type: "threat",
            text: "Competition from established meal kit and grocery delivery services"
          },
          {
            type: "threat",
            text: "Low barriers to entry may invite copycat business models"
          }
        ]
      }
    },
    marketResearch: {
      status: "completed",
      sectionId: "marketResearch",
      createdAt: new Date(),
      updatedAt: new Date(),
      data: {
        marketSize: {
          total: "$51.6B",
          addressable: "$12.4B",
          obtainable: "$248M",
          growth: "15% YoY"
        },
        demographics: {
          primarySegments: ["Busy Professionals", "Health Enthusiasts", "Family Meal Planners"],
          segmentDetails: [
            {
              name: "Busy Professionals",
              characteristics: ["25-45 years", "Urban dwellers", "High income"],
              preferences: ["Convenience", "Time-saving", "Quality ingredients"],
              painPoints: ["Limited time", "Meal planning stress", "Grocery shopping"],
              acquisitionChannels: ["LinkedIn", "Tech blogs", "Product Hunt"]
            },
            {
              name: "Health Enthusiasts",
              characteristics: ["28-35 years", "Fitness-focused", "Diet-conscious"],
              preferences: ["Nutrition tracking", "Custom meal plans", "Fresh ingredients"],
              painPoints: ["Meal prep time", "Recipe variety", "Nutritional balance"],
              acquisitionChannels: ["Fitness apps", "Wellness influencers", "Health blogs"]
            },
            {
              name: "Family Meal Planners",
              characteristics: ["30-50 years", "Family-oriented", "Budget-conscious"],
              preferences: ["Family portions", "Kid-friendly options", "Budget planning"],
              painPoints: ["Meal variety", "Time management", "Budget constraints"],
              acquisitionChannels: ["Parenting blogs", "Family forums", "Local communities"]
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
            name: "AI-Powered Meal Planning",
            description: "Growing adoption of AI for personalized meal recommendations",
            impact: "High",
            timeframe: "2024-2025",
            source: "Food Tech Industry Report 2024",
            opportunities: ["Personalization", "Efficiency"],
            threats: ["Technical complexity", "Data privacy"]
          },
          {
            name: "Sustainable Food Delivery",
            description: "Increasing focus on eco-friendly packaging and delivery methods",
            impact: "Medium",
            timeframe: "Ongoing",
            source: "Sustainability in Food Tech 2024",
            opportunities: ["Brand differentiation", "Customer loyalty"],
            threats: ["Increased costs", "Operational complexity"]
          }
        ],
        competitors: [
          {
            name: "HelloFresh",
            type: "Direct",
            marketShare: "35%",
            strengths: ["Brand recognition", "Established logistics", "Quality ingredients"],
            weaknesses: ["High costs", "Limited flexibility", "Fixed portions"],
            strategy: "Premium meal kit service",
            pricing: "Subscription-based, $8.99/serving",
            differentiators: ["Recipe variety", "Ingredient quality", "Convenience"]
          },
          {
            name: "Instacart",
            type: "Indirect",
            marketShare: "25%",
            strengths: ["Large network", "Fast delivery", "Grocery partnerships"],
            weaknesses: ["No meal planning", "Variable quality", "Higher prices"],
            strategy: "Grocery delivery platform",
            pricing: "Commission-based, 5-15% per order",
            differentiators: ["Speed", "Selection", "Convenience"]
          }
        ],
        regulations: [
          {
            type: "Food Safety",
            description: "FDA compliance requirements for food delivery",
            impact: "High",
            compliance: "Mandatory",
            timeline: "Immediate",
            cost: "Medium",
            jurisdiction: "United States"
          },
          {
            type: "Data Privacy",
            description: "GDPR and CCPA compliance for user data",
            impact: "High",
            compliance: "Mandatory",
            timeline: "Immediate",
            cost: "Medium",
            jurisdiction: "Global"
          }
        ],
        marketDynamics: {
          entryBarriers: [
            {
              barrier: "Regulatory Compliance",
              impact: "High",
              mitigation: "Partner with compliance experts"
            },
            {
              barrier: "Delivery Network",
              impact: "High",
              mitigation: "Strategic partnerships with existing delivery services"
            },
            {
              barrier: "Brand Recognition",
              impact: "Medium",
              mitigation: "Focus on unique value proposition and targeted marketing"
            }
          ],
          supplierPower: "Medium - Grocery partners have moderate bargaining power due to existing relationships",
          buyerPower: "High - Customers have multiple options and low switching costs",
          substitutes: ["Traditional meal planning", "Restaurant delivery", "Meal kits"],
          industryRivalry: "High - Competitive market with established players and low differentiation"
        }
      }
    },
    marketSizeGrowth: {
      status: "completed",
      sectionId: "marketSizeGrowth",
      createdAt: new Date(),
      updatedAt: new Date(),
      data: {
        marketSize: {
          total: "$22.06B",
          addressable: "$12.4B",
          obtainable: "$248M",
          growth: "14.2% CAGR",
          analysis: "The meal planning and grocery delivery market is projected to grow significantly, driven by increasing consumer demand for convenience, health-conscious eating habits, and advancements in AI-powered personalization tools. Key growth drivers include AI integration for personalized meal planning, sustainability trends focusing on food waste reduction, increasing demand for convenience due to busy lifestyles, and rising interest in health-conscious eating including organic and diet-specific meal plans.",
          projections: [
            {
              year: "2025",
              value: "$22.06B"
            },
            {
              year: "2026",
              value: "$47.9B"
            },
            {
              year: "2027",
              value: "$63.3B"
            }
          ]
        }
      }
    },
    targetUsers: {
      status: "completed",
      sectionId: "targetUsers",
      createdAt: new Date(),
      updatedAt: new Date(),
      data: {
        primaryUserPersonas: [
          {
            name: "Busy Professional Beth",
            description: "A 32-year-old corporate professional who values healthy eating but lacks time for meal planning",
            painPoints: [
              "Limited time for meal planning and grocery shopping",
              "Food waste from poor planning",
              "Inconsistent eating habits"
            ],
            needs: [
              "Efficient meal planning solution",
              "Convenient grocery delivery",
              "Healthy recipe suggestions"
            ],
            behaviors: [
              "Orders takeout frequently",
              "Shops for groceries once a week",
              "Uses mobile apps for daily tasks"
            ]
          },
          {
            name: "Health-Conscious Henry",
            description: "A 28-year-old fitness enthusiast who wants to maintain a specific diet",
            painPoints: [
              "Difficulty tracking nutritional goals",
              "Time spent on meal prep",
              "Challenge finding varied healthy recipes"
            ],
            needs: [
              "Nutrition tracking",
              "Meal plan customization",
              "Bulk preparation options"
            ],
            behaviors: [
              "Follows a strict diet",
              "Meal preps weekly",
              "Uses fitness and health apps"
            ]
          }
        ],
        marketSegments: [
          {
            segment: "Urban Professionals",
            size: "12.5M potential users",
            characteristics: [
              "Income > $75k/year",
              "Lives in metropolitan areas",
              "Values convenience",
              "Health-conscious"
            ]
          },
          {
            segment: "Health Enthusiasts",
            size: "8.3M potential users",
            characteristics: [
              "Regular exercise routine",
              "Follows specific diets",
              "Prioritizes nutrition",
              "Tech-savvy"
            ]
          }
        ],
        userStrategy: {
          acquisition: "Focus on digital marketing and app store optimization with emphasis on convenience and health benefits",
          retention: "Implement loyalty program with personalized recommendations and regular feature updates"
        }
      }
    },
    competition: {
      status: "completed",
      sectionId: "competition",
      createdAt: new Date(),
      updatedAt: new Date(),
      data: {
        directCompetitors: [
          {
            name: "HelloFresh",
            description: "Leading meal kit delivery service",
            marketShare: "35%",
            positioning: "premium",
            strengths: [
              "Brand recognition",
              "Established logistics",
              "Quality ingredients"
            ],
            weaknesses: [
              "Higher cost",
              "Less flexibility",
              "Limited customization"
            ],
            pricing: {
              model: "Per meal subscription",
              startingAt: "$8.99 per serving",
              enterprise: "Custom corporate plans"
            }
          },
          {
            name: "Blue Apron",
            description: "Established meal kit service",
            marketShare: "25%",
            positioning: "premium",
            strengths: [
              "Recipe variety",
              "Strong brand",
              "Quality control"
            ],
            weaknesses: [
              "High cost",
              "Fixed portions",
              "Delivery limitations"
            ],
            pricing: {
              model: "Weekly subscription",
              startingAt: "$9.99 per serving",
              enterprise: "Group plans available"
            }
          }
        ],
        indirectCompetitors: [
          {
            name: "Instacart",
            description: "Grocery delivery platform",
            threatLevel: "Medium",
            overlapAreas: [
              "Grocery delivery",
              "Basic meal planning"
            ]
          },
          {
            name: "Local grocery stores",
            description: "Traditional grocery shopping",
            threatLevel: "Low",
            overlapAreas: [
              "Ingredient sourcing",
              "In-person shopping"
            ]
          }
        ],
        competitiveAdvantages: [
          "AI-powered meal personalization",
          "Integrated grocery delivery",
          "Flexible meal planning",
          "Waste reduction features"
        ]
      }
    },
    unitEconomics: {
      status: "completed",
      sectionId: "unitEconomics",
      createdAt: new Date(),
      updatedAt: new Date(),
      data: {
        pricing: {
          model: "Freemium + Commission",
          strategy: "Multi-revenue stream with focus on recurring subscriptions",
          tiers: [
            {
              name: "Basic",
              price: "Free",
              features: [
                "Basic meal planning",
                "Manual shopping lists",
                "Limited recipes"
              ]
            },
            {
              name: "Premium",
              price: "$9.99/month",
              features: [
                "Advanced meal planning",
                "Automatic grocery lists",
                "Nutrition tracking",
                "Recipe customization"
              ]
            },
            {
              name: "Family Plan",
              price: "$14.99/month",
              features: [
                "All Premium features",
                "Family portion sizing",
                "Multiple dietary preferences",
                "Priority support"
              ]
            }
          ]
        },
        costs: {
          fixed: [
            {
              name: "Infrastructure",
              amount: "$15,000",
              frequency: "Monthly"
            },
            {
              name: "Content Creation",
              amount: "$8,000",
              frequency: "Monthly"
            },
            {
              name: "Staff Salaries",
              amount: "$45,000",
              frequency: "Monthly"
            }
          ],
          variable: [
            {
              name: "Customer Support",
              amount: "$2",
              unit: "Per user/month"
            },
            {
              name: "Payment Processing",
              amount: "2.9%",
              unit: "Per transaction"
            },
            {
              name: "Grocery Partner Commission",
              amount: "15%",
              unit: "Per order"
            }
          ]
        },
        metrics: {
          cac: "$35",
          ltv: "$245",
          margin: "68%",
          paybackPeriod: "4 months",
          breakEvenPoint: "25,000 premium users"
        },
        projections: {
          monthly: [
            {
              period: "Month 1",
              revenue: "$50,000",
              costs: "$30,000",
              profit: "$20,000"
            },
            {
              period: "Month 6",
              revenue: "$150,000",
              costs: "$75,000",
              profit: "$75,000"
            },
            {
              period: "Month 12",
              revenue: "$300,000",
              costs: "$120,000",
              profit: "$180,000"
            }
          ]
        }
      }
    },
    marketingChannels: {
      status: "completed",
      sectionId: "marketingChannels",
      createdAt: new Date(),
      updatedAt: new Date(),
      data: {
        channels: [
          {
            name: "Social Media Advertising",
            type: "primary",
            description: "Target health-conscious urban professionals",
            budget: "$20,000",
            timeline: "First 3 months",
            metrics: {
              reach: "1,000,000+",
              cost: "$20,000",
              roi: "5:1",
              conversionRate: "2%"
            }
          },
          {
            name: "Content Marketing",
            type: "primary",
            description: "Recipe blogs and nutrition articles",
            budget: "$10,000",
            timeline: "Ongoing",
            metrics: {
              reach: "500,000+",
              cost: "$10,000",
              roi: "3:1",
              conversionRate: "1.5%"
            }
          },
          {
            name: "Influencer Partnerships",
            type: "secondary",
            description: "Partner with food and wellness influencers",
            budget: "$15,000",
            timeline: "Quarterly campaigns",
            metrics: {
              reach: "750,000+",
              cost: "$15,000",
              roi: "4:1",
              conversionRate: "2.5%"
            }
          }
        ],
        budget: {
          total: "$50,000",
          breakdown: [
            {
              category: "Digital Marketing",
              amount: "$20,000",
              percentage: "40%"
            },
            {
              category: "Content Creation",
              amount: "$15,000",
              percentage: "30%"
            },
            {
              category: "Influencer Marketing",
              amount: "$10,000",
              percentage: "20%"
            },
            {
              category: "PR & Events",
              amount: "$5,000",
              percentage: "10%"
            }
          ]
        }
      }
    },
    goToMarketPlan: {
      status: "completed",
      sectionId: "goToMarketPlan",
      createdAt: new Date(),
      updatedAt: new Date(),
      data: {
        launchStrategy: {
          phases: [
            {
              name: "Beta Launch",
              timeline: "Q2 2024",
              activities: [
                "Launch in 3 major cities",
                "Partner with initial grocery services",
                "Release core features"
              ],
              metrics: [
                "User acquisition rate",
                "Partner integration success",
                "App store rating"
              ]
            },
            {
              name: "Market Expansion",
              timeline: "Q3-Q4 2024",
              activities: [
                "Expand to 10 additional cities",
                "Launch premium features",
                "Implement AI recommendations"
              ],
              metrics: [
                "Geographic expansion",
                "Revenue growth",
                "User satisfaction"
              ]
            }
          ]
        },
        partnerships: [
          {
            type: "Grocery Delivery Services",
            value: "Last-mile delivery capability",
            status: "Essential"
          },
          {
            type: "Recipe Content Creators",
            value: "High-quality recipe content",
            status: "Important"
          },
          {
            type: "Nutrition Experts",
            value: "Content validation and credibility",
            status: "Desired"
          }
        ],
        resources: {
          team: [
            "Product Manager",
            "Full-stack Developers",
            "UX Designer",
            "Content Manager",
            "Partnership Manager"
          ],
          budget: "$750,000 initial investment",
          timeline: "18 months to market maturity"
        }
      }
    },
    vcSentiment: {
      status: "completed",
      sectionId: "vcSentiment",
      createdAt: new Date(),
      updatedAt: new Date(),
      data: {
        overview: {
          score: 82,
          confidence: 90,
          summary: "MicroMeal demonstrates strong potential for VC investment, with a compelling market opportunity, clear revenue model, and strong unit economics. The combination of AI-powered personalization and established delivery infrastructure presents an attractive scaling opportunity.",
          verdict: "Highly Attractive Investment Opportunity"
        },
        investmentAttractiveness: {
          score: 82,
          confidence: 90,
          strengths: [
            "Strong product-market fit with growing demand",
            "Clear path to profitability with multiple revenue streams",
            "Scalable technology platform with AI capabilities",
            "Experienced founding team with domain expertise",
            "High user retention potential through network effects"
          ],
          weaknesses: [
            "High initial capital requirements for market entry",
            "Dependency on third-party delivery partners",
            "Complex partner relationship management needed",
            "Competitive market with established players"
          ],
          opportunities: [
            "Expansion into corporate wellness programs",
            "International market potential",
            "AI-driven personalization capabilities",
            "Integration with smart home devices",
            "Health insurance partnership possibilities"
          ],
          threats: [
            "Intense competition from well-funded competitors",
            "Potential market consolidation",
            "Regulatory changes in food delivery",
            "Economic downturn impact on consumer spending"
          ]
        },
        marketActivity: {
          investmentVolume: {
            total: "$8.2B",
            timeframe: "Last 12 months",
            trend: "increasing",
            growth: "15% YoY",
            analysis: "Food-tech sector showing strong investment momentum with focus on AI and personalization"
          },
          notableTransactions: [
            {
              company: "MealPrime",
              amount: "$15M",
              round: "Series A",
              date: "2024-01-15",
              investors: ["Andreessen Horowitz", "Index Ventures"],
              valuation: "$75M",
              details: "AI-powered meal planning platform",
              useOfFunds: "Market expansion and technology development",
              postMoneyValuation: "$90M",
              multipleFromLastRound: "3x"
            },
            {
              company: "FreshPlate",
              amount: "$8M",
              round: "Seed",
              date: "2024-02-20",
              investors: ["Y Combinator", "Sequoia"],
              valuation: "$40M",
              details: "Smart grocery delivery service",
              useOfFunds: "Product development and team expansion",
              postMoneyValuation: "$48M",
              multipleFromLastRound: "N/A"
            },
            {
              company: "NutriTech",
              amount: "$25M",
              round: "Series B",
              date: "2024-01-05",
              investors: ["Accel", "GV", "Khosla Ventures"],
              valuation: "$120M",
              details: "Nutrition optimization platform",
              useOfFunds: "International expansion",
              postMoneyValuation: "$145M",
              multipleFromLastRound: "2.5x"
            }
          ],
          comparableExits: [
            {
              company: "MealGenius",
              exitType: "Acquisition",
              amount: "$200M",
              acquirer: "Major Food Delivery Platform",
              date: "2023-11",
              multipleOfRevenue: "8x",
              details: "Strategic acquisition to enhance meal planning capabilities"
            },
            {
              company: "SmartKitchen",
              exitType: "IPO",
              amount: "$500M",
              date: "2023-09",
              multipleOfRevenue: "12x",
              details: "Strong public market reception for AI-powered food tech"
            }
          ]
        },
        marketTrends: {
          overview: "The food-tech sector is experiencing rapid evolution with increasing focus on AI-powered personalization and sustainability",
          trends: [
            {
              trend: "AI Integration in Food Tech",
              description: "Growing adoption of AI for personalized meal planning and nutrition optimization",
              impact: "High",
              timeframe: "Current",
              opportunities: ["Personalization at scale", "Improved user retention"],
              challenges: ["Technical complexity", "Data privacy concerns"],
              marketSize: "$15B by 2025",
              growthRate: "25% CAGR"
            },
            {
              trend: "Sustainable Food Delivery",
              description: "Increasing focus on eco-friendly packaging and delivery methods",
              impact: "Medium",
              timeframe: "12-24 months",
              opportunities: ["Brand differentiation", "Cost reduction"],
              challenges: ["Infrastructure development", "Cost management"],
              marketSize: "$8B by 2025",
              growthRate: "18% CAGR"
            },
            {
              trend: "Health-Tech Integration",
              description: "Integration of meal planning with health monitoring devices",
              impact: "High",
              timeframe: "18-36 months",
              opportunities: ["New revenue streams", "User engagement"],
              challenges: ["Technical integration", "Partner management"],
              marketSize: "$12B by 2025",
              growthRate: "22% CAGR"
            }
          ],
          investorSentiment: {
            overall: "Highly Positive",
            keyFactors: [
              "Strong market growth",
              "Clear monetization potential",
              "Technology differentiation",
              "Experienced founding team"
            ],
            concerns: [
              "Market saturation",
              "Customer acquisition costs",
              "Operational complexity"
            ],
            outlook: "Favorable for next 24-36 months with focus on sustainable growth and profitability"
          }
        },
        fundingStrategy: {
          recommendedRound: {
            type: "Series A",
            targetAmount: "$15M",
            timing: "Q2 2024",
            valuation: {
              suggested: "$75M-$90M",
              basis: "5x forward revenue multiple",
              comparables: "Recent food-tech Series A rounds"
            }
          },
          useOfFunds: [
            {
              category: "Product Development",
              allocation: "35%",
              details: "AI capabilities enhancement and platform scaling"
            },
            {
              category: "Market Expansion",
              allocation: "30%",
              details: "Geographic expansion and partner network development"
            },
            {
              category: "Team Growth",
              allocation: "25%",
              details: "Key hires in technology and operations"
            },
            {
              category: "Marketing",
              allocation: "10%",
              details: "User acquisition and brand development"
            }
          ],
          targetInvestors: [
            {
              type: "Lead Investors",
              profile: "Tech-focused VCs with food-tech experience",
              examples: ["Andreessen Horowitz", "Sequoia", "Index Ventures"]
            },
            {
              type: "Strategic Investors",
              profile: "Food delivery platforms and health tech companies",
              examples: ["Corporate VC arms of major food companies"]
            }
          ],
          milestones: [
            {
              milestone: "Market Expansion",
              metric: "Presence in 10 major cities",
              timeline: "12 months"
            },
            {
              milestone: "User Growth",
              metric: "100,000 active users",
              timeline: "18 months"
            },
            {
              milestone: "Revenue",
              metric: "$10M ARR",
              timeline: "24 months"
            }
          ]
        }
      }
    },
    criticalThoughtQuestions: {
      status: "completed",
      sectionId: "criticalThoughtQuestions",
      createdAt: new Date(),
      updatedAt: new Date(),
      data: {
        questions: [
          {
            category: "Market Demand",
            question: "What evidence supports the market need?",
            priority: "high",
            analysis: "The US meal planning market shows strong growth with 64.2M potential users. 82% prioritize healthy eating but lack time for planning.",
            implications: [
              "Large addressable market",
              "Clear user pain points",
              "Strong growth potential"
            ],
            recommendations: [
              "Conduct primary market research",
              "Analyze competitor usage data",
              "Test pricing sensitivity"
            ]
          },
          {
            category: "User Experience",
            question: "How will the platform ensure consistent quality?",
            priority: "high",
            analysis: "Success depends on reliable delivery and consistent recipe quality across different grocery partners.",
            implications: [
              "Need for quality control",
              "Partner management crucial",
              "User satisfaction impact"
            ],
            recommendations: [
              "Develop partner quality metrics",
              "Implement user feedback system",
              "Create service level agreements"
            ]
          }
        ],
        riskAssessment: {
          highPriority: [
            "Partner reliability",
            "User retention"
          ],
          mediumPriority: [
            "Technical integration",
            "Market competition"
          ],
          lowPriority: [
            "Regulatory compliance",
            "Content scaling"
          ]
        }
      }
    },
    reportSummary: {
      status: "completed",
      sectionId: "reportSummary",
      createdAt: new Date(),
      updatedAt: new Date(),
      data: {
        summary: "MicroMeal presents a compelling opportunity in the meal planning and grocery delivery market, with strong potential for growth and profitability. The business model combines subscription revenue with grocery delivery commissions, creating multiple revenue streams. Success will depend on execution, particularly in building and maintaining grocery partnerships while ensuring a high-quality user experience.",
        keyFindings: [
          "Clear market demand with $51.6B TAM",
          "Strong unit economics with 68% margins",
          "Multiple revenue streams",
          "Scalable technology platform",
          "Complex partner relationships require management"
        ],
        recommendations: [
          {
            category: "Product Development",
            priority: "high",
            items: [
              "Focus on core user experience",
              "Implement robust partner integration",
              "Develop quality control systems"
            ]
          },
          {
            category: "Market Entry",
            priority: "high",
            items: [
              "Start with 3 test markets",
              "Build initial grocery partnerships",
              "Validate pricing model"
            ]
          },
          {
            category: "Operations",
            priority: "medium",
            items: [
              "Establish partner onboarding",
              "Create quality metrics",
              "Build support team"
            ]
          }
        ],
        nextSteps: [
          {
            action: "Finalize product roadmap",
            timeline: "1 month",
            owner: "Product Team"
          },
          {
            action: "Secure initial partnerships",
            timeline: "2-3 months",
            owner: "Business Development"
          },
          {
            action: "Begin platform development",
            timeline: "4-6 months",
            owner: "Engineering Team"
          }
        ]
      }
    },
    implementationPlan: {
      status: "completed",
      sectionId: "implementationPlan",
      createdAt: new Date(),
      updatedAt: new Date(),
      data: {
        phases: [
          {
            name: "MVP Launch",
            duration: "3 months",
            objectives: [
              "Launch core meal planning features",
              "Integrate with initial grocery partners",
              "Build basic user interface"
            ],
            resources: [
              "Development team (5 members)",
              "Product manager",
              "UX designer",
              "Marketing budget: $50,000"
            ],
            milestones: [
              "Beta launch with 100 users",
              "First grocery partner integration",
              "Basic meal planning algorithm"
            ],
            risks: [
              {
                risk: "Technical integration delays",
                mitigation: "Early partner engagement",
                impact: "Medium"
              },
              {
                risk: "User adoption challenges",
                mitigation: "Focused marketing campaign",
                impact: "High"
              }
            ]
          },
          {
            name: "Market Expansion",
            duration: "6 months",
            objectives: [
              "Expand to 5 major cities",
              "Launch premium features",
              "Build partner network"
            ],
            resources: [
              "Expanded development team",
              "Sales team",
              "Partner success manager",
              "Marketing budget: $200,000"
            ],
            milestones: [
              "10,000 active users",
              "5 grocery partner integrations",
              "Premium feature launch"
            ],
            risks: [
              {
                risk: "Partner onboarding delays",
                mitigation: "Standardized onboarding process",
                impact: "Medium"
              },
              {
                risk: "Market penetration challenges",
                mitigation: "Local marketing campaigns",
                impact: "High"
              }
            ]
          },
          {
            name: "Scale & Optimize",
            duration: "12 months",
            objectives: [
              "National expansion",
              "AI feature enhancement",
              "Enterprise solutions"
            ],
            resources: [
              "Full product team",
              "Data science team",
              "Enterprise sales team",
              "Marketing budget: $500,000"
            ],
            milestones: [
              "100,000 active users",
              "20+ city coverage",
              "Enterprise client acquisition"
            ],
            risks: [
              {
                risk: "Operational scaling issues",
                mitigation: "Process automation",
                impact: "High"
              },
              {
                risk: "Competitive pressure",
                mitigation: "Product differentiation",
                impact: "High"
              }
            ]
          }
        ],
        criticalPath: [
          "Platform development",
          "Partner integrations",
          "User acquisition",
          "Revenue generation"
        ],
        keyMetrics: [
          {
            metric: "Monthly Active Users",
            target: "100,000",
            timeframe: "12 months"
          },
          {
            metric: "Partner Retention",
            target: "90%",
            timeframe: "Ongoing"
          },
          {
            metric: "User Satisfaction",
            target: "4.5/5",
            timeframe: "Ongoing"
          }
        ],
        feasibilityScore: 85
      }
    },
    financialAnalysis: {
      status: "completed",
      sectionId: "financialAnalysis",
      createdAt: new Date(),
      updatedAt: new Date(),
      data: {
        revenueStreams: [
          {
            name: "Subscription Revenue",
            description: "Monthly subscription fees from users",
            projected: "$2.5M",
            timeframe: "Year 1",
            growth: "15% MoM"
          },
          {
            name: "Grocery Commission",
            description: "Commission from grocery delivery orders",
            projected: "$1.8M",
            timeframe: "Year 1",
            growth: "20% MoM"
          },
          {
            name: "Premium Features",
            description: "Additional features for power users",
            projected: "$800K",
            timeframe: "Year 1",
            growth: "10% MoM"
          }
        ],
        costStructure: {
          fixed: [
            {
              name: "Technology Infrastructure",
              amount: "$15,000",
              frequency: "Monthly",
              notes: "Cloud services, servers, and development tools"
            },
            {
              name: "Content Creation",
              amount: "$8,000",
              frequency: "Monthly",
              notes: "Recipe development and content management"
            },
            {
              name: "Staff Salaries",
              amount: "$45,000",
              frequency: "Monthly",
              notes: "Core team members"
            }
          ],
          variable: [
            {
              name: "Customer Support",
              amount: "$2",
              unit: "Per user/month",
              notes: "Scales with user base"
            },
            {
              name: "Payment Processing",
              amount: "2.9%",
              unit: "Per transaction",
              notes: "Standard payment gateway fees"
            },
            {
              name: "Grocery Partner Commission",
              amount: "15%",
              unit: "Per order",
              notes: "Revenue share with partners"
            }
          ]
        },
        metrics: {
          cac: "$35",
          ltv: "$245",
          margin: "68%",
          paybackPeriod: "4 months",
          breakEvenPoint: "25,000 premium users",
          roi: "7:1"
        },
        projections: {
          monthly: [
            {
              period: "Month 1",
              revenue: "$50,000",
              costs: "$30,000",
              profit: "$20,000",
              users: "1,000"
            },
            {
              period: "Month 6",
              revenue: "$150,000",
              costs: "$75,000",
              profit: "$75,000",
              users: "5,000"
            },
            {
              period: "Month 12",
              revenue: "$300,000",
              costs: "$120,000",
              profit: "$180,000",
              users: "15,000"
            }
          ],
          yearly: [
            {
              year: "2024",
              revenue: "$2.5M",
              costs: "$1.2M",
              profit: "$1.3M",
              users: "50,000"
            },
            {
              year: "2025",
              revenue: "$5M",
              costs: "$2M",
              profit: "$3M",
              users: "100,000"
            }
          ]
        },
        riskAssessment: {
          financialRisks: [
            {
              risk: "Extended runway needs",
              likelihood: "Medium",
              impact: "High",
              mitigation: "Conservative cash management"
            },
            {
              risk: "Revenue model viability",
              likelihood: "Low",
              impact: "High",
              mitigation: "Multiple revenue streams"
            }
          ],
          operationalRisks: [
            {
              risk: "Partner reliability",
              likelihood: "Medium",
              impact: "High",
              mitigation: "Multiple partner strategy"
            },
            {
              risk: "Scaling costs",
              likelihood: "Medium",
              impact: "Medium",
              mitigation: "Automation and optimization"
            }
          ],
          marketRisks: [
            {
              risk: "Competitive pressure",
              likelihood: "High",
              impact: "Medium",
              mitigation: "Product differentiation"
            },
            {
              risk: "Market changes",
              likelihood: "Medium",
              impact: "High",
              mitigation: "Agile product development"
            }
          ]
        }
      }
    }
  }
};

export default function Home() {
  const [selectedDimension, setSelectedDimension] = useState<Dimension | null>(null)

  const dimensions: Dimension[] = [
    {
      name: "Market Opportunity",
      score: 85,
      description:
        "The SaaS productivity space is expected to grow at 12% CAGR over the next 5 years, creating a favorable environment for new entrants with differentiated offerings. TaskFlow AI targets a growing market with significant potential.",
      details: [
        {
          title: "Market Size",
          content: "The global productivity software market is valued at $102B and expected to reach $185B by 2030.",
        },
        {
          title: "Growth Rate",
          content: "12% CAGR in the productivity SaaS segment, outpacing the overall software market.",
        },
        {
          title: "Target Segment",
          content: "Knowledge workers and teams (estimated 850M globally) represent a massive addressable market.",
        },
        {
          title: "Market Trends",
          content: "Increasing demand for AI-powered tools that reduce cognitive load and automate routine decisions.",
        },
      ],
    },
    {
      name: "Problem Validation",
      score: 80,
      description:
        "The problem being addressed is real and significant for the target audience. There's evidence that current solutions don't fully address the pain points identified, creating an opportunity for TaskFlow AI.",
      details: [
        {
          title: "Pain Point Validation",
          content:
            "Studies show knowledge workers spend 41% of their time on tasks that could be automated or delegated.",
        },
        {
          title: "User Research",
          content: "Interviews with 25 potential users confirmed frustration with manual prioritization.",
        },
        {
          title: "Existing Solutions",
          content: "Current tools require significant manual input to prioritize and schedule tasks.",
        },
        {
          title: "Market Gap",
          content: "Few solutions effectively use AI to reduce the cognitive load of task management.",
        },
      ],
    },
    {
      name: "Solution Differentiation",
      score: 65,
      description:
        "The solution offers some unique features, but could benefit from further differentiation from existing alternatives. Consider focusing more on the unique value proposition to stand out in the market.",
      details: [
        {
          title: "Key Differentiators",
          content: "AI-powered prioritization based on work patterns and deadlines is novel.",
        },
        {
          title: "Competitive Advantage",
          content: "Moderate - the core technology is innovative but could be replicated.",
        },
        {
          title: "Unique Features",
          content: "Automatic scheduling and reprioritization based on changing conditions.",
        },
        { title: "Areas to Strengthen", content: "Need clearer differentiation from emerging AI productivity tools." },
      ],
    },
    {
      name: "Revenue Potential",
      score: 70,
      description:
        "The product shows good revenue potential with a viable business model. The pricing strategy aligns with market expectations, though customer lifetime value could be improved.",
      details: [
        { title: "Pricing Model", content: "Freemium with $15/user/month for premium features is competitive." },
        { title: "Revenue Projections", content: "Potential for $1.2M ARR within 18 months based on adoption rates." },
        { title: "Customer LTV", content: "Estimated at $450 based on industry retention rates." },
        {
          title: "Monetization Strategy",
          content: "Multiple tiers with team/enterprise options provide good scaling potential.",
        },
      ],
    },
    {
      name: "Technical Feasibility",
      score: 90,
      description:
        "The technical implementation is highly feasible with current technologies. The founding team has the necessary technical expertise to build the proposed solution.",
      details: [
        {
          title: "Technology Stack",
          content: "Proposed stack (React, Node.js, Python for ML) is appropriate for the solution.",
        },
        { title: "AI Implementation", content: "Required ML models are well-established with available frameworks." },
        { title: "Development Timeline", content: "MVP timeline of 3 months is realistic given the scope." },
        { title: "Technical Risks", content: "Low - core functionality can be built with proven technologies." },
      ],
    },
    {
      name: "Customer Acquisition",
      score: 50,
      description:
        "The customer acquisition strategy needs significant refinement. The current plan lacks clear channels and has a high estimated CAC relative to the industry benchmark.",
      details: [
        { title: "Acquisition Channels", content: "Overreliance on paid advertising without proven organic channels." },
        {
          title: "Customer Acquisition Cost",
          content: "Estimated CAC of $120 is high compared to industry benchmark of $75.",
        },
        { title: "Go-to-Market Strategy", content: "Lacks clear differentiation in messaging and positioning." },
        {
          title: "Recommendations",
          content: "Develop content marketing strategy and focus on product-led growth tactics.",
        },
      ],
    },
    {
      name: "Competitive Landscape",
      score: 55,
      description:
        "The competitive landscape is crowded with established players. While there's room for innovation, the product will face significant competition from both large platforms and emerging startups.",
      details: [
        { title: "Key Competitors", content: "Asana, ClickUp, Monday.com dominate with 65% market share combined." },
        { title: "Competitive Intensity", content: "High - 15+ established products with similar core functionality." },
        { title: "Barriers to Entry", content: "Moderate - network effects and switching costs benefit incumbents." },
        {
          title: "Competitive Advantage",
          content: "AI capabilities provide short-term advantage but may be quickly replicated.",
        },
      ],
    },
    {
      name: "Founder/Team Fit",
      score: 85,
      description:
        "The founding team is well-positioned to execute on this idea with relevant technical expertise and domain knowledge. The team composition is well-balanced for the challenges ahead.",
      details: [
        {
          title: "Technical Expertise",
          content: "Strong - CTO has 8 years of ML/AI experience and relevant projects.",
        },
        { title: "Domain Knowledge", content: "CEO has worked in productivity software for 5+ years." },
        { title: "Team Composition", content: "Good balance of technical and business expertise." },
        { title: "Identified Gaps", content: "Could benefit from adding marketing expertise to the founding team." },
      ],
    },
  ]

  const handleDimensionClick = (dimension: Dimension) => {
    setSelectedDimension(dimension)
  }

  const handleBackClick = () => {
    setSelectedDimension(null)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <Lightbulb className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold">ValidFlow</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/about">
            About
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/signin">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section with background image */}
          <section className="w-full min-h-[80vh] relative flex items-center py-12 md:py-24 lg:py-32 xl:py-48 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}>
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80"></div>
            <div className="container relative pl-8 md:pl-12 pr-4 md:pr-6 z-10">
              <div className="max-w-3xl">
                <div className="relative">
                  <div className="space-y-8">
                    <div className="h-[180px] sm:h-[200px] flex items-center">
                      <TypingAnimation
                        ideas={productIdeas}
                        className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                        staticText="ValidFlow"
                        typingSpeed={100}
                        deleteSpeed={50}
                        pauseDuration={2000}
                      />
                    </div>
                    <p className="max-w-[600px] text-white/90 md:text-xl text-left">
                      AI-powered analysis to evaluate your product concept, highlight strengths, weaknesses, and market
                      opportunities before you invest time and resources.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row mt-8">
                  <Link href="/validate">
                    <Button size="lg" className="gap-1 bg-black hover:bg-black/90">
                      Try ValidFlow <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button size="lg" variant="outline" className="bg-black hover:bg-black/90 text-white border-white/20">
                      View Pricing
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section with solid background */}
          <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our AI-powered platform analyzes your product idea across multiple dimensions to provide comprehensive
                    validation insights.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">1. Input Your Idea</h3>
                    <p className="text-muted-foreground">
                      Share details about your product concept, target market, and business model through our structured form.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-center space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">2. AI Analysis</h3>
                    <p className="text-muted-foreground">
                      Our AI engine analyzes market trends, competitor landscape, and evaluates your idea across 8 key dimensions.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-center space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">3. Get Actionable Insights</h3>
                    <p className="text-muted-foreground">
                      Receive a comprehensive validation report with strengths, weaknesses, and recommendations for your next steps.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sample Analysis Section with background image */}
          <section className="relative w-full py-12 md:py-24 lg:py-32 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}>
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
            <div className="container relative px-4 md:px-6 z-10">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">Sample Analysis</h2>
                  <p className="max-w-[900px] text-white/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    See what insights you'll get from our AI-powered validation platform
                  </p>
                </div>
              </div>
              <div className="mt-12">
                <AnalysisDisplay analysis={sampleAnalysis} hideProgress={true} />
              </div>
            </div>
          </section>

          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Ready to Validate Your Idea?
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Start with our free tier or upgrade to premium for comprehensive insights.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/validate">
                    <Button size="lg">Get Started</Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2025 ValidFlow. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
} 