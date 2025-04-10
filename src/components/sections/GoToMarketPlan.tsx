import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GoToMarketPlan as GoToMarketPlanData, BaseSectionResponse } from "@/lib/ai/models";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, Info, DollarSign, Users, BarChart2 } from "lucide-react";

interface GoToMarketPlanProps extends BaseSectionResponse {
  data?: GoToMarketPlanData['data'];
}

function GoToMarketPlanContent({ data, status, error }: GoToMarketPlanProps) {
  console.log('GoToMarketPlan - Rendering with:', { status, error, data });

  if (status === 'pending') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Go-to-Market Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
            Generating go-to-market plan...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === 'failed') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Go-to-Market Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || "Go-to-Market Plan could not be generated."}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (status === 'completed' && (!data || !data.launchStrategy || !data.channelStrategies || !data.phasedRolloutPlan)) {
    console.warn('[GoToMarketPlan] Completed status but missing required data fields.', data);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Go-to-Market Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="default">
            <Info className="h-4 w-4" />
            <AlertDescription>
              {error ? `Error: ${error}` : 'Go-to-market plan data is incomplete or the structure is incorrect.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  if (status === 'completed' && data) {
    const { 
      launchStrategy, 
      keyPartnerships, 
      resourceRequirements, 
      channelStrategies, 
      industryConversionBenchmarks, 
      phasedRolloutPlan 
    } = data;
    
    const phases = launchStrategy?.phases || [];
    const partnerships = keyPartnerships || [];
    const resources = resourceRequirements || { team: [], budget: '', technology: [] };
    const channels = channelStrategies || [];
    const rollout = phasedRolloutPlan || [];

    return (
      <Card>
        <CardHeader>
          <CardTitle>Go-to-Market Plan</CardTitle>
          <CardDescription>Strategies for launching, acquiring customers, and scaling.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full space-y-4">
            {phases.length > 0 && (
              <AccordionItem value="launch-strategy">
                <AccordionTrigger>Launch Strategy</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  {phases.map((phase: { phase: string; timeline: string; activities: string[]; metrics: string[]; }, index: number) => (
                    <div key={index} className="p-3 bg-muted rounded-lg border">
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
                </AccordionContent>
              </AccordionItem>
            )}

            {channels.length > 0 && (
              <AccordionItem value="channel-strategies">
                 <AccordionTrigger>Channel Strategies & Benchmarks</AccordionTrigger>
                 <AccordionContent className="space-y-4 pt-2">
                    {industryConversionBenchmarks && (
                      <Alert>
                        <BarChart2 className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Industry Benchmarks:</strong> {industryConversionBenchmarks}
                        </AlertDescription>
                      </Alert>
                    )}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Channel</TableHead>
                          <TableHead>Strategy</TableHead>
                          <TableHead>Est. CAC</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {channels.map((channel: { channel: string; strategy: string; estimatedCAC: string; }, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{channel.channel}</TableCell>
                            <TableCell>{channel.strategy}</TableCell>
                            <TableCell>{channel.estimatedCAC}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                 </AccordionContent>
              </AccordionItem>
            )}

            {rollout.length > 0 && (
              <AccordionItem value="phased-rollout">
                <AccordionTrigger>Phased Rollout Plan</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  {rollout.map((phase: { phase: string; timeline: string; userTarget?: string; revenueTarget?: string; keyActivities: string[]; }, index: number) => (
                    <div key={index} className="p-3 bg-muted rounded-lg border">
                      <h4 className="font-medium mb-2">{phase.phase || `Rollout Phase ${index + 1}`}</h4>
                      <p className="text-sm text-muted-foreground mb-3">Timeline: {phase.timeline}</p>
                      <div className="flex space-x-4 mb-3">
                        {phase.userTarget && <p className="text-sm flex items-center"><Users className="h-4 w-4 mr-1 text-muted-foreground"/> Target: {phase.userTarget}</p>}
                        {phase.revenueTarget && <p className="text-sm flex items-center"><DollarSign className="h-4 w-4 mr-1 text-muted-foreground"/> Target: {phase.revenueTarget}</p>}
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-1">Key Activities</h5>
                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                           {phase.keyActivities.map((activity: string, i: number) => <li key={i}>{activity}</li>)}
                        </ul>
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            )}

            {partnerships.length > 0 && (
              <AccordionItem value="partnerships">
                <AccordionTrigger>Key Partnerships</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                   {partnerships.map((partnership: { partner: string; type: string; value: string; }, index: number) => (
                     <div key={index} className="p-3 bg-muted rounded-lg border">
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
                </AccordionContent>
              </AccordionItem>
            )}

            {(resources.team && resources.team.length > 0 || resources.budget || resources.technology && resources.technology.length > 0) && (
              <AccordionItem value="resources">
                <AccordionTrigger>Resource Requirements</AccordionTrigger>
                 <AccordionContent className="space-y-4 pt-2">
                  {resources.team && resources.team.length > 0 && (
                    <div className="p-3 bg-muted rounded-lg border">
                      <h4 className="font-medium mb-2">Team</h4>
                      <ul className="list-disc list-inside text-muted-foreground text-sm">
                        {resources.team.map((member: string, index: number) => <li key={index}>{member}</li>)}
                      </ul>
                    </div>
                  )}
                  {resources.budget && (
                    <div className="p-3 bg-muted rounded-lg border">
                      <h4 className="font-medium mb-2">Budget</h4>
                      <p className="text-muted-foreground">{resources.budget}</p>
                    </div>
                  )}
                  {resources.technology && resources.technology.length > 0 && (
                    <div className="p-3 bg-muted rounded-lg border">
                      <h4 className="font-medium mb-2">Technology Stack</h4>
                      <ul className="list-disc list-inside text-muted-foreground text-sm">
                        {resources.technology.map((tech: string, index: number) => <li key={index}>{tech}</li>)}
                      </ul>
                    </div>
                  )}
                 </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </CardContent>
      </Card>
    );
  }
}

export function GoToMarketPlan(props: GoToMarketPlanProps) {
  return (
    <ErrorBoundary>
      <GoToMarketPlanContent {...props} />
    </ErrorBoundary>
  );
} 