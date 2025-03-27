import { Calendar, Flag, Target, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DetailedAnalysis } from "@/lib/models/analysis"

interface PhaseProps {
  phase: string
  timeline: string
  goals: string[]
  activities: string[]
  metrics: string[]
  status: "planned" | "in-progress" | "completed"
}

function PhaseCard({ phase, timeline, goals, activities, metrics, status }: PhaseProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{phase}</CardTitle>
            <CardDescription>{timeline}</CardDescription>
          </div>
          <Badge
            variant={
              status === "completed"
                ? "default"
                : status === "in-progress"
                ? "secondary"
                : "outline"
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Goals
            </h4>
            <ul className="grid gap-2">
              {goals.map((goal, index) => (
                <li key={index} className="text-sm flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {goal}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Flag className="h-4 w-4 text-primary" />
              Key Activities
            </h4>
            <ul className="grid gap-2">
              {activities.map((activity, index) => (
                <li key={index} className="text-sm flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {activity}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Success Metrics
            </h4>
            <ul className="grid gap-2">
              {metrics.map((metric, index) => (
                <li key={index} className="text-sm flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {metric}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface GoToMarketStrategyProps {
  data: DetailedAnalysis["implementationPlan"]
}

export default function GoToMarketStrategy({ data }: GoToMarketStrategyProps) {
  const phases: PhaseProps[] = [
    {
      phase: "Phase 1: Beta Launch",
      timeline: "Months 1-3",
      status: "completed",
      goals: [
        "Validate core features with early adopters",
        "Gather user feedback and testimonials",
        "Optimize user onboarding flow",
      ],
      activities: [
        "Launch invite-only beta program",
        "Conduct user interviews and surveys",
        "Implement feedback loop system",
      ],
      metrics: [
        "500 beta users",
        "80% user satisfaction rate",
        "Average session duration > 20 mins",
      ],
    },
    {
      phase: "Phase 2: Market Entry",
      timeline: "Months 4-6",
      status: "in-progress",
      goals: [
        "Achieve product-market fit",
        "Establish brand presence",
        "Build initial user base",
      ],
      activities: [
        "Launch marketing website",
        "Implement referral program",
        "Start content marketing",
      ],
      metrics: [
        "5,000 active users",
        "15% conversion rate",
        "$50k MRR",
      ],
    },
    {
      phase: "Phase 3: Growth & Scale",
      timeline: "Months 7-12",
      status: "planned",
      goals: [
        "Accelerate user acquisition",
        "Expand feature set",
        "Increase market share",
      ],
      activities: [
        "Launch paid acquisition campaigns",
        "Develop partnership program",
        "Expand to new markets",
      ],
      metrics: [
        "50,000 active users",
        "20% MoM growth",
        "$500k MRR",
      ],
    },
  ]

  const channels = [
    {
      name: "Social Media Marketing",
      budget: "$15,000/mo",
      focus: "Brand awareness and community building",
      platforms: ["Instagram", "TikTok", "YouTube"],
    },
    {
      name: "Content Marketing",
      budget: "$10,000/mo",
      focus: "Education and organic growth",
      platforms: ["Blog", "Newsletter", "Podcast"],
    },
    {
      name: "Influencer Partnerships",
      budget: "$20,000/mo",
      focus: "Credibility and reach",
      platforms: ["Fitness influencers", "Health experts", "Athletes"],
    },
    {
      name: "Paid Advertising",
      budget: "$25,000/mo",
      focus: "User acquisition",
      platforms: ["Facebook Ads", "Google Ads", "Instagram Ads"],
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Go-to-Market Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div>
              <h3 className="font-semibold mb-4">Implementation Phases</h3>
              <div className="space-y-6">
                {data.phases.map((phase, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">{phase.name}</h4>
                      <Badge variant="outline">{phase.duration}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Objectives</h5>
                        <ul className="list-disc pl-5 space-y-1">
                          {phase.objectives.map((objective, i) => (
                            <li key={i} className="text-sm text-muted-foreground">
                              {objective}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium mb-2">Required Resources</h5>
                        <ul className="list-disc pl-5 space-y-1">
                          {phase.resources.map((resource, i) => (
                            <li key={i} className="text-sm text-muted-foreground">
                              {resource}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h5 className="text-sm font-medium mb-2">Key Milestones</h5>
                      <ul className="list-disc pl-5 space-y-1">
                        {phase.milestones.map((milestone, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            {milestone}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Critical Path</h3>
              <div className="space-y-2">
                {data.criticalPath.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Key Performance Metrics</h3>
              <ul className="list-disc pl-5 space-y-2">
                {data.keyMetrics.map((metric, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    {metric}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Marketing Channels</CardTitle>
          <CardDescription>Primary channels and budget allocation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {channels.map((channel, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{channel.name}</h3>
                  <Badge variant="secondary">{channel.budget}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{channel.focus}</p>
                <div className="flex flex-wrap gap-2">
                  {channel.platforms.map((platform, platformIndex) => (
                    <Badge key={platformIndex} variant="outline">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 