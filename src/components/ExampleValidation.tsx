import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Users, Building2, Target, BarChart2, Check, X, Megaphone, PieChart, LineChart, Rocket, Calendar, Target as TargetIcon, Users2, Briefcase, Server, TrendingUp, DollarSign, Activity, Brain, Clock, ThumbsUp, AlertTriangle, ChevronDown, ChevronUp, Beaker, ClipboardList, BarChart, Info, TestTube, MessageSquare, SplitSquareHorizontal, FileText, Flag, ArrowRight, Share2, Download } from "lucide-react";

interface KeyFinding {
  type: 'strength' | 'opportunity' | 'weakness' | 'threat';
  title: string;
  description: string;
}

const coreHypotheses = [
  {
    hypothesis: "Teams will pay $8-25 per user per month for a productivity tool that centralizes tasks, communication, and document sharing.",
    priority: "high"
  },
  {
    hypothesis: "Streamlined workflows and reduced context-switching between tools will lead to improved team productivity and satisfaction.",
    priority: "high"
  },
  {
    hypothesis: "Remote and hybrid teams have a greater need for integrated project management and collaboration tools compared to co-located teams.",
    priority: "medium"
  },
  {
    hypothesis: "Small to medium-sized businesses, marketing agencies, software development teams, and professional service firms are the ideal target market for TaskFlow.",
    priority: "medium"
  },
  {
    hypothesis: "Offering a freemium plan will attract a large user base and lead to a significant number of paid conversions.",
    priority: "low"
  }
];

const hypothesisExperiments = [
  {
    hypothesis: "Teams will pay $8-25 per user per month for a productivity tool that centralizes tasks, communication, and document sharing.",
    experiment: "Conduct a landing page test with a sign-up form and pricing information to gauge interest and willingness to pay.",
    metric: "Achieve a 5% conversion rate from unique visitors to sign-ups."
  },
  {
    hypothesis: "Streamlined workflows and reduced context-switching between tools will lead to improved team productivity and satisfaction.",
    experiment: "Develop a prototype with core features and conduct user testing with 10 teams to gather feedback on productivity improvements.",
    metric: "8/10 teams report increased productivity and satisfaction compared to their current tools."
  },
  {
    hypothesis: "Remote and hybrid teams have a greater need for integrated project management and collaboration tools compared to co-located teams.",
    experiment: "Conduct a survey targeting 100 remote and hybrid teams to assess their current pain points and interest in an integrated solution.",
    metric: "70% of surveyed teams express a strong need for an integrated tool like TaskFlow."
  },
  {
    hypothesis: "Small to medium-sized businesses, marketing agencies, software development teams, and professional service firms are the ideal target market for TaskFlow.",
    experiment: "Analyze website traffic and sign-ups from the landing page test to determine the most engaged target segments.",
    metric: "At least 60% of sign-ups come from the identified target market segments."
  }
];

const validationTimeline = {
  "First 30 Days": [
    "Develop a landing page with pricing information and a sign-up form.",
    "Launch a targeted ad campaign to drive traffic to the landing page.",
    "Conduct a survey to assess the needs of remote and hybrid teams."
  ],
  "Days 31-60": [
    "Analyze landing page conversion rates and user demographics.",
    "Develop a clickable prototype with core features for user testing.",
    "Conduct user testing with 10 teams and gather feedback on productivity improvements."
  ],
  "Days 61-90": [
    "Refine the product based on user testing feedback.",
    "Develop an MVP with core features and begin beta testing with 20 teams.",
    "Iterate on the pricing model based on feedback and market research."
  ]
};

const kpis = [
  {
    metric: "User Sign-Ups",
    targetValue: "500 new sign-ups",
    timeframe: "First 90 Days",
    trackingMethod: "Monitor sign-up funnels and track new registered users via analytics dashboards.",
    tools: "Tools: Google Analytics, Mixpanel"
  },
  {
    metric: "Active Users",
    targetValue: "At least 40% of sign-ups active weekly",
    timeframe: "First 90 Days",
    trackingMethod: "Track weekly active users (WAU) through event tracking and user session analytics.",
    tools: "Tools: Mixpanel, Amplitude"
  },
  {
    metric: "Feature Usage Rate",
    targetValue: "50% of active users using at least 3 key features regularly",
    timeframe: "First 90 Days",
    trackingMethod: "Instrument key features with usage tracking events and analyze feature adoption patterns.",
    tools: "Tools: Mixpanel, Heap Analytics"
  },
  {
    metric: "Conversion Rate from Freemium to Paid",
    targetValue: "5% conversion",
    timeframe: "First 90 Days",
    trackingMethod: "Track subscription upgrades and calculate conversion rate from free to paid tiers.",
    tools: "Tools: Stripe Analytics, Chargebee, Mixpanel"
  },
  {
    metric: "Customer Feedback and NPS",
    targetValue: "Average NPS of 30+ and collection of at least 100 detailed feedback responses",
    timeframe: "First 90 Days",
    trackingMethod: "Collect NPS surveys and qualitative feedback through periodic user surveys and in-app prompts.",
    tools: "Tools: Typeform, Delighted, SurveyMonkey"
  }
];

const mvpPrototypes = [
  {
    name: "Landing Page",
    description: "Create a landing page that highlights the key features and benefits of TaskFlow. Include a sign-up form to gauge interest and collect email addresses from potential users.",
    assumptions: [
      "Demand exists for a new project management tool",
      "Proposed key features resonate with the target audience",
      "Visitors are willing to provide their email for early access"
    ]
  },
  {
    name: "Concierge MVP",
    description: "Offer a manual service to a small number of users, mimicking the core functionality of TaskFlow. Work closely with these users to understand their needs and gather feedback.",
    assumptions: [
      "The proposed solution effectively solves real user pain points",
      "Users find value in the core features and are willing to pay",
      "The target market is accessible and receptive to the solution"
    ]
  }
];

const interviewFramework = {
  purpose: "Validate problem and gauge interest",
  keyQuestions: [
    "What are the biggest challenges you face when managing projects with remote or hybrid teams?",
    "How do you currently handle task management, team communication, and document collaboration?",
    "What frustrates you most about the tools you currently use for project management?",
    "If there was a solution that could streamline your workflow and improve productivity, what key features would you expect it to have?",
    "How much would you be willing to pay per user per month for a tool that effectively solves these problems?"
  ]
};

const abTesting = [
  {
    feature: "Pricing plans and feature packaging",
    variants: "Variant A: Freemium with limited features and paid plans starting at $12/user/month vs. Variant B: 30-day free trial with full features and paid plans starting at $15/user/month",
    metric: "Trial sign-up conversion rate and subsequent paid plan conversion rate"
  }
];

interface Recommendation {
  title: string;
  priority: "high" | "medium" | "low";
  timeline: string;
  resources: string[];
  criteria: string;
}

interface RecommendationSet {
  product: Recommendation[];
  market: Recommendation[];
}

interface NextStep {
  title: string;
  priority: "high" | "medium" | "low";
  timeline: string;
  resources: string[];
  criteria: string;
}

const recommendations: RecommendationSet = {
  product: [
    {
      title: "Enhance user experience with AI-driven insights for project management",
      priority: "high",
      timeline: "Next 6 months",
      resources: ["AI expertise", "User feedback", "Development time"],
      criteria: "Positive user feedback and increased engagement"
    },
    {
      title: "Implement robust security features to appeal to enterprise customers",
      priority: "high",
      timeline: "Next 3 months",
      resources: ["Security expert", "Budget for security tools"],
      criteria: "No vulnerabilities found in security audits"
    }
  ],
  market: [
    {
      title: "Conduct market research to refine the product's unique value proposition",
      priority: "high",
      timeline: "Next 3 months",
      resources: ["Market research firm", "Time", "Budget"],
      criteria: "Clear unique value proposition identified"
    },
    {
      title: "Develop a targeted marketing strategy focusing on key industries",
      priority: "medium",
      timeline: "Next 6 months",
      resources: ["Marketing team", "Industry reports", "Ad budget"],
      criteria: "Increased brand awareness in target industries"
    }
  ]
};

const immediateNextSteps: NextStep[] = [
  {
    title: "Initiate development of AI-driven project management insights feature",
    priority: "high",
    timeline: "Next 4 months",
    resources: ["AI development team", "Budget for R&D"],
    criteria: "Completion of MVP for AI feature"
  },
  {
    title: "Begin market research to identify unique value proposition",
    priority: "high",
    timeline: "Next 3 months",
    resources: ["Market research firm", "Budget"],
    criteria: "Identification of unique value proposition"
  }
];

const keyFindings = [
  "There is a growing demand for project management tools that cater to remote and hybrid teams.",
  "TaskFlow's integration capabilities and flexible task management options (Kanban, Gantt, list views) are significant assets.",
  "The freemium model is a proven approach in the software industry, facilitating user acquisition.",
  "The pricing model aligns with industry standards but may need adjustments based on targeted customer segments' feedback.",
  "Cross-platform synchronization addresses a key pain point for users, but execution and user experience will be critical.",
  "TaskFlow's target market is highly competitive, with several established players.",
  "The need for a differentiated marketing strategy and clear value proposition is imperative for market penetration."
];

interface Competitor {
  name: string;
  marketShare: number;
  description: string;
  marketPosition: string;
  strengths: string[];
  weaknesses: string[];
  pricing: string;
}

interface FeatureSet {
  [key: string]: boolean | string;
}

interface FeatureComparison {
  competitors: {
    [key: string]: FeatureSet;
  };
  features: string[];
}

interface DetailedFeatureComparison {
  feature: string;
  asana: {
    supported: boolean;
    details: string;
  };
  trello: {
    supported: boolean;
    details: string;
  };
  monday: {
    supported: boolean;
    details: string;
  };
  clickup: {
    supported: boolean;
    details: string;
  };
}

export function ExampleValidation() {
  const [openSection, setOpenSection] = useState<string | null>("core-hypotheses");
  const [openExperimentSection, setOpenExperimentSection] = useState<string | null>("mvp");

  const findings: KeyFinding[] = [
    {
      type: 'strength',
      title: 'Comprehensive Feature Set',
      description: 'Addresses key pain points for remote teams, such as context-switching and communication silos.'
    },
    {
      type: 'strength',
      title: 'Flexible Pricing Model',
      description: 'Caters to the needs of both small teams and large enterprises, increasing market potential.'
    },
    {
      type: 'opportunity',
      title: 'Growing Remote Work Demand',
      description: 'Growing demand for remote work solutions due to the COVID-19 pandemic and the increasing adoption of hybrid work models.'
    },
    {
      type: 'opportunity',
      title: 'Strategic Partnerships',
      description: 'Potential for strategic partnerships and integrations with complementary tools and services to enhance the platform\'s value proposition.'
    },
    {
      type: 'weakness',
      title: 'Limited Brand Recognition',
      description: 'Lack of brand recognition and market presence compared to established competitors in the project management software space.'
    },
    {
      type: 'weakness',
      title: 'Third-party Dependencies',
      description: 'Dependence on third-party services for certain features, such as email and calendar integration, which may limit control over user experience and data security.'
    },
    {
      type: 'threat',
      title: 'Intense Competition',
      description: 'Intense competition from well-funded and entrenched rivals like Asana, Monday.com, and Trello, which have larger user bases and more extensive resources.'
    },
    {
      type: 'threat',
      title: 'Commoditization Risk',
      description: 'Risk of commoditization as project management features become increasingly standardized and offered by a growing number of competitors.'
    }
  ];

  const getColorClass = (type: string) => {
    switch (type) {
      case 'strength':
        return 'bg-green-50 border-green-200';
      case 'opportunity':
        return 'bg-blue-50 border-blue-200';
      case 'weakness':
        return 'bg-red-50 border-red-200';
      case 'threat':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const marketBreakdown = {
    sam: {
      value: "$1.4 billion",
      description: "The serviceable addressable market for small to medium-sized businesses and professional service firms, focusing on the U.S. and European regions",
      limitations: [
        "Limited geographical reach outside the U.S. and Europe initially",
        "Focus primarily on small to medium-sized businesses",
        "Dependence on digital marketing strategies for expansion"
      ]
    },
    som: {
      value: "$360k to $720k",
      description: "The obtainable market share in the first year, assuming a modest market penetration of 0.25% to 0.5%",
      assumptions: [
        "Effective marketing strategy to reach small businesses",
        "Strong early partnerships or integrations",
        "Competitive pricing strategy"
      ]
    }
  };

  const userPersonas = [
    {
      name: "Emma the Marketing Manager",
      age: 35,
      role: "Marketing Manager",
      context: "Medium-sized digital marketing agency, leads team of 15 including content creators, SEO experts, and graphic designers",
      description: "Emma oversees a team of 15, including content creators, SEO experts, and graphic designers, working on multiple projects for various clients. She's always looking for ways to improve team collaboration and efficiency.",
      painPoints: [
        "Difficulty in tracking project progress across different teams",
        "Inefficient communication leading to missed deadlines",
        "Struggle to keep all documents and versions in one accessible place"
      ],
      needs: [
        "A unified platform to view and manage all tasks",
        "An efficient way to communicate with team members and share feedback",
        "A central repository for all project-related documents"
      ],
      behaviors: [
        "Researches and adopts new tools that increase team productivity",
        "Prefers tools that are intuitive and require minimal training",
        "Values platforms that offer detailed analytics to track team performance"
      ]
    },
    {
      name: "David the Software Development Leader",
      age: 40,
      role: "Software Development Leader",
      context: "Leads remote team of 20 developers across different time zones",
      description: "David leads a remote software development team of 20 people scattered across different time zones. His primary focus is on streamlining development processes, ensuring timely delivery of projects, and maintaining high-quality standards.",
      painPoints: [
        "Coordinating tasks across different time zones",
        "Managing and tracking time spent on tasks for accurate billing",
        "Lack of integration with other tools used by the team"
      ],
      needs: [
        "A flexible task management system that supports asynchronous work",
        "Integrated time tracking that's easy for team members to use",
        "Seamless integration with code repositories and other development tools"
      ],
      behaviors: [
        "Always on the lookout for tools that can integrate into their existing workflow",
        "Prefers platforms with high levels of customization and security",
        "Advocates for tools that offer detailed reports and analytics"
      ]
    }
  ];

  const marketSegments = [
    {
      name: "Digital Marketing Agencies",
      size: "Medium to Large",
      characteristics: [
        "Teams are often project-based, working on multiple projects at once",
        "High need for collaboration and communication tools",
        "Require flexibility in task management to handle diverse projects"
      ]
    },
    {
      name: "Remote Software Development Teams",
      size: "Medium to Large",
      characteristics: [
        "Work across various time zones, requiring asynchronous collaboration",
        "Need robust integration with development tools and services",
        "Value platforms that enhance productivity and streamline workflows"
      ]
    }
  ];

  const userStrategy = {
    acquisition: {
      title: "Acquisition Strategy",
      description: "Leverage targeted online advertising focusing on industry-specific platforms and forums. Partner with industry influencers and offer them to use TaskFlow for free in exchange for reviews and endorsements. Attend and sponsor relevant industry conferences and webinars to showcase TaskFlow's capabilities. Offer a distinct referral program that rewards current users for bringing in new teams."
    },
    retention: {
      title: "Retention Strategy",
      description: "Provide exceptional customer support, including dedicated account managers for enterprise clients. Continuously release new features based on user feedback and industry trends. Offer comprehensive onboarding sessions and resources to ensure users can fully leverage TaskFlow. Implement a loyalty program that offers discounts and rewards for long-term subscribers."
    }
  };

  const competitors: Competitor[] = [
    {
      name: "Asana",
      marketShare: 20,
      description: "A widely used project management and team collaboration platform offering flexible task views like Kanban boards, timelines, and lists, with built-in messaging, file sharing, and integration capabilities tailored for teams of all sizes.",
      marketPosition: "mid-market / advanced",
      strengths: [
        "Highly customizable task management with multiple views",
        "Strong integration ecosystem including calendar, email, and file services",
        "Robust automation and workflow templates",
        "User-friendly interface with good mobile and desktop apps"
      ],
      weaknesses: [
        "Can be expensive for larger teams",
        "Steeper learning curve for advanced features",
        "Limited time tracking natively"
      ],
      pricing: "Subscription-based with freemium tier"
    },
    {
      name: "Trello",
      marketShare: 15,
      description: "A simple, visual project management tool focused on Kanban boards, suitable for small teams and straightforward task organization with integrations for broader workflow needs.",
      marketPosition: "economy / basic",
      strengths: [
        "Highly visual and easy to use Kanban interface",
        "Flexible with many third-party integrations",
        "Freemium model widely adopted"
      ],
      weaknesses: [
        "Limited native support for Gantt charts and advanced views",
        "No built-in team messaging or document version control",
        "Basic reporting and analytics"
      ],
      pricing: "Freemium with tiered subscriptions"
    },
    {
      name: "Monday.com",
      marketShare: 18,
      description: "A work OS platform providing highly customizable project management with multiple task views, built-in communication, automation, time tracking, and extensive integrations aimed at teams of all sizes.",
      marketPosition: "mid-market / enterprise",
      strengths: [
        "Robust feature set including time tracking and automation",
        "Strong built-in communication tools",
        "Highly customizable workflows and templates"
      ],
      weaknesses: [
        "Higher cost for full feature access",
        "Can be overwhelming for new users",
        "Some advanced features require higher pricing tiers"
      ],
      pricing: "Subscription-based with tiered plans"
    },
    {
      name: "ClickUp",
      marketShare: 10,
      description: "An all-in-one productivity platform combining task management, docs, goals, chat, time tracking, and automation aimed at improving team collaboration for a broad range of industries.",
      marketPosition: "economy / advanced",
      strengths: [
        "Comprehensive feature set covering all areas from tasks to docs",
        "Affordable pricing with generous free tier",
        "Strong customization and integrations"
      ],
      weaknesses: [
        "Interface can be complex and overwhelming",
        "Performance issues reported for large teams",
        "Steep learning curve"
      ],
      pricing: "Freemium with tiered subscription plans"
    }
  ];

  const detailedFeatureComparison: DetailedFeatureComparison[] = [
    {
      feature: "Kanban boards",
      asana: { supported: true, details: "Fully supported with drag-and-drop" },
      trello: { supported: true, details: "Core functionality" },
      monday: { supported: true, details: "Fully supported" },
      clickup: { supported: true, details: "Fully supported" }
    },
    {
      feature: "Gantt charts",
      asana: { supported: true, details: "Available through Timeline view" },
      trello: { supported: false, details: "Available only via paid Power-Ups (add-ons)" },
      monday: { supported: true, details: "Available as timeline view" },
      clickup: { supported: true, details: "Available via timeline and Gantt views" }
    },
    {
      feature: "List views",
      asana: { supported: true, details: "Core feature" },
      trello: { supported: true, details: "Supported via board lists" },
      monday: { supported: true, details: "Core feature" },
      clickup: { supported: true, details: "Core list view supported" }
    },
    {
      feature: "Built-in team messaging",
      asana: { supported: false, details: "Uses task comments; no dedicated messaging threads" },
      trello: { supported: false, details: "Comments per card only" },
      monday: { supported: true, details: "Includes updates and comment threads" },
      clickup: { supported: true, details: "Includes chat and comments" }
    },
    {
      feature: "Document collaboration with version control",
      asana: { supported: false, details: "Supports file attachment but no native version control" },
      trello: { supported: false, details: "Files can be attached but no version control" },
      monday: { supported: true, details: "Supports file versioning and commenting" },
      clickup: { supported: true, details: "Docs with version history" }
    },
    {
      feature: "Time tracking",
      asana: { supported: false, details: "Requires third-party integration" },
      trello: { supported: false, details: "Requires Power-Up integrations" },
      monday: { supported: true, details: "Built-in time tracking functionality" },
      clickup: { supported: true, details: "Native time tracking included" }
    },
    {
      feature: "Productivity analytics",
      asana: { supported: true, details: "Provides reporting and dashboards" },
      trello: { supported: false, details: "Limited analytics without add-ons" },
      monday: { supported: true, details: "Dashboards and analytics available" },
      clickup: { supported: true, details: "Provides dashboards and reporting" }
    },
    {
      feature: "Automated workflow templates",
      asana: { supported: true, details: "Customizable rules and automation" },
      trello: { supported: true, details: "Supports automation via Butler" },
      monday: { supported: true, details: "Strong automation builder" },
      clickup: { supported: true, details: "Rich automation capabilities" }
    },
    {
      feature: "Custom fields and tagging",
      asana: { supported: true, details: "Extensive custom field support" },
      trello: { supported: true, details: "Available with Power-Ups" },
      monday: { supported: true, details: "Highly customizable fields" },
      clickup: { supported: true, details: "Highly customizable" }
    },
    {
      feature: "Cross-platform synchronization",
      asana: { supported: true, details: "Available on web, desktop, and mobile" },
      trello: { supported: true, details: "Web, desktop, mobile apps" },
      monday: { supported: true, details: "Web, desktop, mobile apps" },
      clickup: { supported: true, details: "Web, mobile, desktop apps" }
    },
    {
      feature: "Integration with email, calendar, file storage",
      asana: { supported: true, details: "Wide range of integrations" },
      trello: { supported: true, details: "Multiple integrations via Power-Ups" },
      monday: { supported: true, details: "Wide integration support" },
      clickup: { supported: true, details: "Wide integration support" }
    }
  ];

  const marketingChannels = [
    {
      name: "Content Marketing",
      description: "Creating and distributing valuable, relevant, and consistent content to attract and retain a clearly defined audience.",
      type: "primary",
      budget: "30% of total marketing budget",
      timeline: "Ongoing with the first 3 months focused on ramping up content production",
      metrics: {
        reach: "50,000-100,000 monthly views",
        cost: "Low to medium",
        roi: "High",
        conversion: "2-5%"
      },
      budgetAmount: "$30,000"
    },
    {
      name: "Social Media Advertising",
      description: "Paid ads on platforms such as LinkedIn, Facebook, and Twitter targeting professionals and businesses.",
      type: "secondary",
      budget: "25% of total marketing budget",
      timeline: "First 6 months after launch",
      metrics: {
        reach: "200,000-500,000 impressions",
        cost: "Medium",
        roi: "Medium",
        conversion: "1-3%"
      },
      budgetAmount: "$25,000"
    },
    {
      name: "Email Marketing",
      description: "Utilizing email campaigns to nurture leads and keep current users engaged.",
      type: "primary",
      budget: "15% of total marketing budget",
      timeline: "Ongoing",
      metrics: {
        reach: "Direct to subscribed and opted-in audience",
        cost: "Low",
        roi: "High",
        conversion: "10-20%"
      },
      budgetAmount: "$15,000"
    },
    {
      name: "Influencer Partnerships",
      description: "Collaborating with influencers and thought leaders in the industry to promote TaskFlow.",
      type: "experimental",
      budget: "20% of total marketing budget",
      timeline: "First year post-launch",
      metrics: {
        reach: "Varies significantly",
        cost: "High",
        roi: "Variable",
        conversion: "0.5-1.5%"
      },
      budgetAmount: "$20,000"
    },
    {
      name: "Webinars and Online Workshops",
      description: "Hosting webinars and workshops to demonstrate the value of TaskFlow to potential customers.",
      type: "secondary",
      budget: "10% of total marketing budget",
      timeline: "Starting second quarter after launch",
      metrics: {
        reach: "1,000-5,000 attendees per event",
        cost: "Medium",
        roi: "Medium to high",
        conversion: "3-8%"
      },
      budgetAmount: "$10,000"
    }
  ];

  const launchPhases = [
    {
      name: "Pre-Launch",
      timeline: "Q2 2024",
      activities: [
        "Build MVP",
        "Initiate beta testing with select small businesses",
        "Develop marketing materials",
        "Establish key partnerships"
      ],
      metrics: [
        "Completion of MVP",
        "Acquisition of 100 beta testers",
        "Partnership agreements signed"
      ]
    },
    {
      name: "Soft Launch",
      timeline: "Q4 2024",
      activities: [
        "Open beta testing to a wider audience",
        "Launch content marketing campaign",
        "Collect and analyze user feedback",
        "Optimize product based on feedback"
      ],
      metrics: [
        "500 active beta users",
        "Feedback collection completion",
        "25% product improvement based on feedback"
      ]
    },
    {
      name: "Public Launch",
      timeline: "Q2 2025",
      activities: [
        "Official market release",
        "Expand marketing efforts",
        "Scale customer support",
        "Monitor and optimize user acquisition channels"
      ],
      metrics: [
        "1,000 paying customers",
        "Positive ROAS",
        "Customer support satisfaction > 90%"
      ]
    }
  ];

  const channelStrategies = [
    {
      channel: "Content Marketing",
      strategy: "Develop and distribute valuable, relevant, and consistent content to attract and retain a clearly-defined audience",
      cac: "Low"
    },
    {
      channel: "Paid Advertising",
      strategy: "Use targeted ads on social media and search engines to drive traffic and user sign-ups",
      cac: "$100-$150"
    },
    {
      channel: "Partnership Marketing",
      strategy: "Collaborate with complementary businesses to co-market each other's services",
      cac: "Medium"
    },
    {
      channel: "SEO",
      strategy: "Optimize website and content for search engines to increase visibility and organic traffic",
      cac: "Low"
    },
    {
      channel: "Email Marketing",
      strategy: "Nurture leads and engage users with personalized email campaigns",
      cac: "Medium"
    }
  ];

  const rolloutPhases = [
    {
      name: "Beta Test",
      timeline: "Q3-Q4 2024",
      targets: [
        "100 beta users",
        "Feedback and product validation"
      ],
      activities: [
        "Recruit beta users",
        "Collect and analyze feedback",
        "Product refinement"
      ]
    },
    {
      name: "Early Adopters",
      timeline: "Q1 2025",
      targets: [
        "500 paying customers",
        "$10k MRR"
      ],
      activities: [
        "Implement learned improvements",
        "Launch targeted marketing campaigns",
        "Onboard early adopters with incentives"
      ]
    },
    {
      name: "General Availability",
      timeline: "Q2 2025",
      targets: [
        "1k+ paying customers",
        "$50k+ MRR"
      ],
      activities: [
        "Scale marketing efforts",
        "Expand product features based on user demand",
        "Optimize customer support"
      ]
    }
  ];

  const partnerships = [
    {
      category: "Technology",
      name: "Cloud storage providers (e.g., Dropbox, Google Drive)",
      description: "Seamless integration for document collaboration and storage"
    },
    {
      category: "Marketing",
      name: "Leading project management influencers",
      description: "Leverage influence for brand credibility and user acquisition"
    },
    {
      category: "Channel",
      name: "Professional services firms",
      description: "Expand reach within target market through established client networks"
    }
  ];

  const resources = {
    team: [
      "Software Developers",
      "Product Managers",
      "Marketing Specialists",
      "Customer Support Representatives"
    ],
    budget: "$200k-$500k",
    technology: [
      "Cloud Infrastructure",
      "Analytics Tools"
    ]
  };

  const marketTrends = [
    {
      name: "AI-driven workflow optimization",
      impact: "High",
      timeline: "Immediate",
      icon: Brain
    },
    {
      name: "Consolidation of collaboration tools",
      impact: "Medium",
      timeline: "Mid-term",
      icon: Users2
    },
    {
      name: "Remote-first work infrastructure",
      impact: "High",
      timeline: "Long-term",
      icon: Building2
    }
  ];

  const notableTransactions = [
    {
      date: "2024-02",
      company: "Motion",
      round: "Series A",
      amount: "$13M",
      investors: "YC Continuity, Khosla Ventures"
    },
    {
      date: "2023-11",
      company: "Tempo",
      round: "Seed",
      amount: "$8M",
      investors: "Slack Fund, Basis Set"
    }
  ];

  const investmentStrengths = [
    "Comprehensive feature set addressing multiple pain points (time tracking, document collaboration, analytics)",
    "Freemium model lowers adoption barriers",
    "Hybrid work trends support market demand",
    "Multiple revenue streams (subscriptions, enterprise services, API access)"
  ];

  const investmentWeaknesses = [
    "Intense competition from established players (Asana, ClickUp, Trello)",
    "Unproven differentiation in a crowded market",
    "Dependence on third-party integrations",
    "Potential complexity in balancing customization with usability"
  ];

  const investorFactors = [
    "Recurring revenue models",
    "Enterprise digital transformation budgets",
    "Product-led growth potential"
  ];

  const investorConcerns = [
    "Valuation corrections in SaaS",
    "Customer acquisition costs",
    "Feature parity with incumbents"
  ];

  return (
    <div className="w-full py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center mb-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Example Validation Analysis
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Check out this real validation analysis of a project management tool
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Executive Summary */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Executive Summary</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Project</h3>
                <p className="text-muted-foreground">TaskFlow - Streamlined Project Management for Remote Teams</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Viability Score</h3>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-semibold text-green-600">
                    82/100
                  </div>
                  <span className="text-muted-foreground capitalize">
                    (Positive)
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Summary</h3>
                <p className="text-muted-foreground">
                  TaskFlow is a promising project management and collaboration platform that addresses the unique challenges faced by remote and hybrid teams. By centralizing essential functions like task management, communication, document sharing, and workflow automation within a single, user-friendly interface, TaskFlow aims to boost productivity and reduce the inefficiencies caused by context-switching between multiple tools.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Key Findings</h3>
                <div className="grid gap-3">
                  {findings.map((finding, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg ${
                        finding.type === 'strength' ? 'bg-green-50 text-green-900' :
                        finding.type === 'weakness' ? 'bg-red-50 text-red-900' :
                        finding.type === 'opportunity' ? 'bg-blue-50 text-blue-900' :
                        'bg-yellow-50 text-yellow-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium capitalize">
                          {finding.type}
                        </span>
                      </div>
                      <p className="text-sm">{finding.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Size & Growth */}
          <Card>
            <CardHeader>
              <CardTitle>Market Size & Growth</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <h5 className="font-medium">Total Market Size (TAM)</h5>
                  <p className="text-2xl font-bold text-blue-600">$13.82 billion</p>
                  <p className="text-sm text-muted-foreground">
                    The global project management software market is projected to reach this value by 2026
                  </p>
                </div>

                <div className="space-y-3">
                  <h5 className="font-medium">Growth Rate & Drivers</h5>
                  <p className="text-2xl font-bold text-blue-600">12% CAGR</p>
                  <p className="text-sm text-muted-foreground">
                    Increasing adoption of remote work and hybrid teams; Growing need for integrated tools; Advancements in AI and automation
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="font-medium">Market Breakdown</h5>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h6 className="font-medium">Serviceable Addressable Market (SAM)</h6>
                    <span className="text-blue-600 font-bold">{marketBreakdown.sam.value}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{marketBreakdown.sam.description}</p>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Limitations:</p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside">
                      {marketBreakdown.sam.limitations.map((limitation, index) => (
                        <li key={index}>{limitation}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h6 className="font-medium">Serviceable Obtainable Market (SOM)</h6>
                    <span className="text-blue-600 font-bold">{marketBreakdown.som.value}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{marketBreakdown.som.description}</p>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Assumptions:</p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside">
                      {marketBreakdown.som.assumptions.map((assumption, index) => (
                        <li key={index}>{assumption}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Target Users Analysis */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <CardTitle>Target Users Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <h5 className="font-medium">Primary User Personas</h5>
                <div className="grid gap-6 md:grid-cols-2">
                  {userPersonas.map((persona, index) => (
                    <div key={index} className="bg-card border rounded-lg p-4 space-y-4">
                      <div className="space-y-2">
                        <h6 className="font-semibold text-lg">{persona.name}</h6>
                        <p className="text-sm text-muted-foreground">{persona.description}</p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h6 className="font-medium text-sm">Pain Points</h6>
                          <ul className="mt-1 text-sm text-muted-foreground list-disc list-inside">
                            {persona.painPoints.map((point, i) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h6 className="font-medium text-sm">Needs</h6>
                          <ul className="mt-1 text-sm text-muted-foreground list-disc list-inside">
                            {persona.needs.map((need, i) => (
                              <li key={i}>{need}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h6 className="font-medium text-sm">Behaviors</h6>
                          <ul className="mt-1 text-sm text-muted-foreground list-disc list-inside">
                            {persona.behaviors.map((behavior, i) => (
                              <li key={i}>{behavior}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <h5 className="font-medium">Market Segments</h5>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {marketSegments.map((segment, index) => (
                    <div key={index} className="bg-muted/50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <h6 className="font-medium">{segment.name}</h6>
                        <span className="text-sm text-muted-foreground">{segment.size}</span>
                      </div>
                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                        {segment.characteristics.map((char, i) => (
                          <li key={i}>{char}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <h5 className="font-medium">User Strategy</h5>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.values(userStrategy).map((strategy, index) => (
                    <div key={index} className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <h6 className="font-medium">{strategy.title}</h6>
                      <p className="text-sm text-muted-foreground">{strategy.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Competition Analysis */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <CardTitle>Competition Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h5 className="font-medium">Direct Competitors</h5>
                <div className="grid gap-6 md:grid-cols-2">
                  {competitors.map((competitor, index) => (
                    <div key={index} className="bg-card border rounded-lg p-4 space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h6 className="font-semibold text-lg">{competitor.name}</h6>
                          <Badge variant={Number(competitor.marketShare) > 20 ? "default" : "secondary"}>
                            {competitor.marketShare}% Market Share
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{competitor.description}</p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h6 className="font-medium text-sm">Market Position</h6>
                          <p className="mt-1 text-sm text-muted-foreground">{competitor.marketPosition}</p>
                        </div>

                        <div>
                          <h6 className="font-medium text-sm">Strengths</h6>
                          <ul className="mt-1 text-sm text-muted-foreground list-disc list-inside">
                            {competitor.strengths.map((strength, i) => (
                              <li key={i}>{strength}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h6 className="font-medium text-sm">Weaknesses</h6>
                          <ul className="mt-1 text-sm text-muted-foreground list-disc list-inside">
                            {competitor.weaknesses.map((weakness, i) => (
                              <li key={i}>{weakness}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h6 className="font-medium text-sm">Pricing</h6>
                          <p className="mt-1 text-sm text-muted-foreground">{competitor.pricing}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="font-medium">Feature Comparison</h5>
                <div className="relative overflow-x-auto border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-muted text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">Feature</th>
                        <th className="px-4 py-3 text-left font-medium">Asana</th>
                        <th className="px-4 py-3 text-left font-medium">Trello</th>
                        <th className="px-4 py-3 text-left font-medium">Monday.com</th>
                        <th className="px-4 py-3 text-left font-medium">ClickUp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailedFeatureComparison.map((feature, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-background" : "bg-muted/50"}>
                          <td className="px-4 py-3 font-medium">{feature.feature}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-start gap-2">
                              {feature.asana.supported ? (
                                <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              ) : (
                                <X className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                              )}
                              <span className="text-muted-foreground">{feature.asana.details}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-start gap-2">
                              {feature.trello.supported ? (
                                <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              ) : (
                                <X className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                              )}
                              <span className="text-muted-foreground">{feature.trello.details}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-start gap-2">
                              {feature.monday.supported ? (
                                <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              ) : (
                                <X className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                              )}
                              <span className="text-muted-foreground">{feature.monday.details}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-start gap-2">
                              {feature.clickup.supported ? (
                                <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              ) : (
                                <X className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                              )}
                              <span className="text-muted-foreground">{feature.clickup.details}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Performance Indicators */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <BarChart className="h-5 w-5" />
                <CardTitle>Key Performance Indicators</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Metric</th>
                      <th className="text-left py-3 px-4 font-medium">Target Value</th>
                      <th className="text-left py-3 px-4 font-medium">Timeframe</th>
                      <th className="text-left py-3 px-4 font-medium">Tracking Method & Tools</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kpis.map((kpi, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{kpi.metric}</span>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-blue-600 font-medium">{kpi.targetValue}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{kpi.timeframe}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <p className="text-sm">{kpi.trackingMethod}</p>
                            <p className="text-sm text-muted-foreground">{kpi.tools}</p>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Core Hypotheses and Experiments */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Beaker className="h-5 w-5" />
                <CardTitle>Core Hypotheses and Experiments</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h5 className="font-medium">Key Hypotheses</h5>
                <div className="grid gap-4">
                  {coreHypotheses.map((item, index) => (
                    <div key={index} className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{item.hypothesis}</p>
                        <Badge variant={item.priority === 'high' ? 'default' : 'secondary'}>
                          {item.priority} priority
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="font-medium">Validation Experiments</h5>
                <div className="grid gap-4">
                  {hypothesisExperiments.map((item, index) => (
                    <div key={index} className="bg-card border rounded-lg p-4 space-y-3">
                      <p className="font-medium">{item.hypothesis}</p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <TestTube className="h-4 w-4 mt-1" />
                          <p className="text-sm">{item.experiment}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <Target className="h-4 w-4 mt-1" />
                          <p className="text-sm text-muted-foreground">{item.metric}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Validation Timeline */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <CardTitle>Validation Timeline</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {Object.entries(validationTimeline).map(([phase, activities], index) => (
                  <div key={index} className="bg-card border rounded-lg p-4 space-y-3">
                    <h6 className="font-medium">{phase}</h6>
                    <ul className="space-y-2">
                      {activities.map((activity, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 mt-1" />
                          <span className="text-sm text-muted-foreground">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Marketing Strategy */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Megaphone className="h-5 w-5" />
                <CardTitle>Marketing Strategy</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h5 className="font-medium">Marketing Channels</h5>
                <div className="grid gap-4 md:grid-cols-2">
                  {marketingChannels.map((channel, index) => (
                    <div key={index} className="bg-card border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <h6 className="font-semibold">{channel.name}</h6>
                        <Badge variant={channel.type === 'primary' ? 'default' : 'secondary'}>
                          {channel.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{channel.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="font-medium">Budget</p>
                          <p className="text-muted-foreground">{channel.budget}</p>
                        </div>
                        <div>
                          <p className="font-medium">Timeline</p>
                          <p className="text-muted-foreground">{channel.timeline}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Expected Metrics:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>Reach: {channel.metrics.reach}</li>
                          <li>Cost: {channel.metrics.cost}</li>
                          <li>ROI: {channel.metrics.roi}</li>
                          <li>Conversion: {channel.metrics.conversion}</li>
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="font-medium">Channel Strategies</h5>
                <div className="grid gap-4 md:grid-cols-2">
                  {channelStrategies.map((strategy, index) => (
                    <div key={index} className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <h6 className="font-medium">{strategy.channel}</h6>
                      <p className="text-sm text-muted-foreground">{strategy.strategy}</p>
                      <p className="text-sm">CAC: {strategy.cac}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Launch and Rollout Plan */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Rocket className="h-5 w-5" />
                <CardTitle>Launch and Rollout Plan</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h5 className="font-medium">Launch Phases</h5>
                <div className="grid gap-4">
                  {launchPhases.map((phase, index) => (
                    <div key={index} className="bg-card border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <h6 className="font-semibold">{phase.name}</h6>
                        <Badge>{phase.timeline}</Badge>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium">Activities:</p>
                          <ul className="mt-1 text-sm text-muted-foreground list-disc list-inside">
                            {phase.activities.map((activity, i) => (
                              <li key={i}>{activity}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Success Metrics:</p>
                          <ul className="mt-1 text-sm text-muted-foreground list-disc list-inside">
                            {phase.metrics.map((metric, i) => (
                              <li key={i}>{metric}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="font-medium">Rollout Timeline</h5>
                <div className="grid gap-4">
                  {rolloutPhases.map((phase, index) => (
                    <div key={index} className="bg-muted/50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <h6 className="font-medium">{phase.name}</h6>
                        <Badge variant="outline">{phase.timeline}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium">Targets:</p>
                          <ul className="mt-1 text-sm text-muted-foreground list-disc list-inside">
                            {phase.targets.map((target, i) => (
                              <li key={i}>{target}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Key Activities:</p>
                          <ul className="mt-1 text-sm text-muted-foreground list-disc list-inside">
                            {phase.activities.map((activity, i) => (
                              <li key={i}>{activity}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment Analysis */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <CardTitle>Investment Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h5 className="font-medium">Investment Strengths</h5>
                  <ul className="space-y-2">
                    {investmentStrengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ThumbsUp className="h-4 w-4 mt-1 text-green-500" />
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h5 className="font-medium">Investment Weaknesses</h5>
                  <ul className="space-y-2">
                    {investmentWeaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 mt-1 text-yellow-500" />
                        <span className="text-sm">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="font-medium">Market Trends</h5>
                <div className="grid gap-4 md:grid-cols-3">
                  {marketTrends.map((trend, index) => (
                    <div key={index} className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        {React.createElement(trend.icon, { className: "h-4 w-4" })}
                        <h6 className="font-medium">{trend.name}</h6>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Impact: {trend.impact}</span>
                        <span>Timeline: {trend.timeline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="font-medium">Notable Market Transactions</h5>
                <div className="relative overflow-x-auto border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-muted text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Company</th>
                        <th className="px-4 py-3 text-left">Round</th>
                        <th className="px-4 py-3 text-left">Amount</th>
                        <th className="px-4 py-3 text-left">Investors</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notableTransactions.map((transaction, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-background" : "bg-muted/50"}>
                          <td className="px-4 py-3">{transaction.date}</td>
                          <td className="px-4 py-3 font-medium">{transaction.company}</td>
                          <td className="px-4 py-3">{transaction.round}</td>
                          <td className="px-4 py-3">{transaction.amount}</td>
                          <td className="px-4 py-3">{transaction.investors}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partnerships and Resources */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Share2 className="h-5 w-5" />
                <CardTitle>Partnerships and Resources</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h5 className="font-medium">Strategic Partnerships</h5>
                <div className="grid gap-4 md:grid-cols-3">
                  {partnerships.map((partnership, index) => (
                    <div key={index} className="bg-card border rounded-lg p-4 space-y-2">
                      <Badge>{partnership.category}</Badge>
                      <h6 className="font-medium">{partnership.name}</h6>
                      <p className="text-sm text-muted-foreground">{partnership.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="font-medium">Required Resources</h5>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <h6 className="font-medium">Team</h6>
                    <ul className="text-sm text-muted-foreground list-disc list-inside">
                      {resources.team.map((member, index) => (
                        <li key={index}>{member}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <h6 className="font-medium">Budget</h6>
                    <p className="text-sm text-muted-foreground">{resources.budget}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <h6 className="font-medium">Technology</h6>
                    <ul className="text-sm text-muted-foreground list-disc list-inside">
                      {resources.technology.map((tech, index) => (
                        <li key={index}>{tech}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Final Summary & Next Steps */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <CardTitle>Final Summary & Next Steps</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary */}
              <div className="space-y-4">
                <h5 className="font-medium">Summary</h5>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    TaskFlow is well-positioned to address the needs of remote and hybrid teams by centralizing project management and team collaboration. Its comprehensive feature set, designed to reduce tool context-switching and enhance productivity, aligns with current market trends towards flexible work arrangements. However, the competitive landscape in software for project management and team collaboration is dense, requiring TaskFlow to differentiate effectively.
                  </p>
                </div>
              </div>

              {/* Key Findings */}
              <div className="space-y-4">
                <h5 className="font-medium">Key Findings</h5>
                <div className="bg-muted/50 rounded-lg p-4">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {keyFindings.map((finding, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Info className="h-4 w-4 mt-1" />
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-4">
                <h5 className="font-medium">Recommendations</h5>
                
                {/* Product Recommendations */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h6 className="font-medium">Product</h6>
                    <Badge>high Priority</Badge>
                  </div>
                  <div className="grid gap-4">
                    {recommendations.product.map((rec, index) => (
                      <div key={index} className="bg-card border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <h6 className="font-medium">{rec.title}</h6>
                          <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                            {rec.priority}
                          </Badge>
                        </div>
                        <div className="grid gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className="text-muted-foreground">Timeline: {rec.timeline}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Server className="h-4 w-4 mt-1" />
                            <span className="text-muted-foreground">Resources: {rec.resources.join(', ')}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Target className="h-4 w-4 mt-1" />
                            <span className="text-muted-foreground">Success Criteria: {rec.criteria}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Market Recommendations */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h6 className="font-medium">Market</h6>
                    <Badge>high Priority</Badge>
                  </div>
                  <div className="grid gap-4">
                    {recommendations.market.map((rec, index) => (
                      <div key={index} className="bg-card border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <h6 className="font-medium">{rec.title}</h6>
                          <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                            {rec.priority}
                          </Badge>
                        </div>
                        <div className="grid gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className="text-muted-foreground">Timeline: {rec.timeline}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Server className="h-4 w-4 mt-1" />
                            <span className="text-muted-foreground">Resources: {rec.resources.join(', ')}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Target className="h-4 w-4 mt-1" />
                            <span className="text-muted-foreground">Success Criteria: {rec.criteria}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Immediate Next Steps */}
              <div className="space-y-4">
                <h5 className="font-medium">Immediate Next Steps</h5>
                <div className="grid gap-4">
                  {immediateNextSteps.map((step, index) => (
                    <div key={index} className="bg-card border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <h6 className="font-medium">{step.title}</h6>
                        <Badge variant={step.priority === 'high' ? 'destructive' : 'secondary'}>
                          {step.priority}
                        </Badge>
                      </div>
                      <div className="grid gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span className="text-muted-foreground">Timeline: {step.timeline}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Server className="h-4 w-4 mt-1" />
                          <span className="text-muted-foreground">Resources: {step.resources.join(', ')}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Target className="h-4 w-4 mt-1" />
                          <span className="text-muted-foreground">Success Criteria: {step.criteria}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center mt-8">
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/validate'}
              className="bg-black hover:bg-black/90"
            >
              Analyze Your Idea <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}