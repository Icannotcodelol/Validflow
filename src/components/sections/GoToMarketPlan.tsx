import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoToMarketPlanData } from "@/types/sections";

interface GoToMarketPlanProps {
  data: GoToMarketPlanData;
}

export function GoToMarketPlan({ data }: GoToMarketPlanProps) {
  console.log('GoToMarketPlan - Rendering with data:', data);

  // Early return if data is invalid or has error
  if (!data || data.status === 'failed' || data.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Go-to-Market Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {data?.error || "Go-to-Market Plan could not be rendered due to missing data."}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Extract data with fallbacks
  const phases = data.launchStrategy?.phases || [];
  const partnerships = data.keyPartnerships || [];
  const resources = data.resourceRequirements || { team: [], budget: '', technology: [] };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Go-to-Market Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {phases.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Launch Strategy</h3>
              <div className="grid gap-4">
                {phases.map((phase, index) => (
                  <div key={index} className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">{phase.phase || `Phase ${index + 1}`}</h4>
                    {phase.timeline && (
                      <p className="text-sm text-muted-foreground mb-3">Timeline: {phase.timeline}</p>
                    )}
                    {phase.activities && phase.activities.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium mb-1">Activities</h5>
                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                          {phase.activities.map((activity, i) => (
                            <li key={i}>{activity}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {phase.metrics && phase.metrics.length > 0 && (
                      <div className="mt-3">
                        <h5 className="text-sm font-medium mb-1">Success Metrics</h5>
                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                          {phase.metrics.map((metric, i) => (
                            <li key={i}>{metric}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {partnerships.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Key Partnerships</h3>
              <div className="grid gap-4">
                {partnerships.map((partnership, index) => (
                  <div key={index} className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">{partnership.partner || `Partner ${index + 1}`}</h4>
                      {partnership.type && (
                        <span className="text-sm text-muted-foreground">{partnership.type}</span>
                      )}
                    </div>
                    {partnership.value && (
                      <p className="text-muted-foreground">{partnership.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(resources.team && resources.team.length > 0 || resources.budget || resources.technology && resources.technology.length > 0) && (
            <div>
              <h3 className="font-semibold mb-4">Resource Requirements</h3>
              <div className="space-y-4">
                {resources.team && resources.team.length > 0 && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Team</h4>
                    <ul className="list-disc list-inside text-muted-foreground">
                      {resources.team.map((member, index) => (
                        <li key={index}>{member}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {resources.budget && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Budget</h4>
                    <p className="text-muted-foreground">{resources.budget}</p>
                  </div>
                )}

                {resources.technology && resources.technology.length > 0 && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Technology Stack</h4>
                    <ul className="list-disc list-inside text-muted-foreground">
                      {resources.technology.map((tech, index) => (
                        <li key={index}>{tech}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 