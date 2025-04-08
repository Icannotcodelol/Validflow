import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Users, Target, BarChart, Info } from "lucide-react";
import type { TargetUsersData } from "@/types/sections";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface TargetUsersProps {
  data?: TargetUsersData;
  status: 'pending' | 'completed' | 'failed';
  error?: string;
}

function TargetUsersContent({ data, status, error }: TargetUsersProps) {
  console.log('TargetUsers - Rendering with:', { status, error, data });

  if (status === 'pending') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Target Users Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
            Generating target user analysis...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === 'failed') {
    return renderError(
      error || "Failed to generate Target Users analysis."
    );
  }

  if (status === 'completed' && (!data || !data.primaryUserPersonas || data.primaryUserPersonas.length === 0)) {
    console.warn('[TargetUsers] Completed status but missing data or primaryUserPersonas.', data);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Target Users Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="default"> 
            <Info className="h-4 w-4" />
            <AlertDescription>
              {error ? `Error: ${error}` : 'Target users data (personas) is unavailable or the structure is incorrect.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  if (status === 'completed' && data) {
    const hasPersonas = data.primaryUserPersonas && data.primaryUserPersonas.length > 0;
    const hasSegments = data.userSegments && data.userSegments.length > 0;

    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle>Target Users Analysis</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {hasPersonas && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Primary User Personas</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.primaryUserPersonas!.map((persona, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="bg-primary/5">
                      <CardTitle className="text-lg">{persona.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{persona.description}</p>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      <div>
                        <h5 className="text-sm font-medium text-primary mb-2">Pain Points</h5>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {persona.painPoints.map((point, i) => (
                            <li key={i} className="ml-2">{point}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-primary mb-2">Needs</h5>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {persona.needs.map((need, i) => (
                            <li key={i} className="ml-2">{need}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-primary mb-2">Behaviors</h5>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {persona.behaviors.map((behavior, i) => (
                            <li key={i} className="ml-2">{behavior}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {hasSegments && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BarChart className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Market Segments</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {data.userSegments!.map((segment, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{segment.segment}</CardTitle>
                        <span className="text-sm font-medium text-primary">{segment.size}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <h5 className="text-sm font-medium text-primary mb-2">Key Characteristics</h5>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {segment.characteristics.map((char, i) => (
                            <li key={i} className="ml-2">{char}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {(data.userAcquisitionStrategy || data.userRetentionStrategy) && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">User Strategy</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {data.userAcquisitionStrategy && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Acquisition Strategy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{data.userAcquisitionStrategy}</p>
                    </CardContent>
                  </Card>
                )}
                {data.userRetentionStrategy && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Retention Strategy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{data.userRetentionStrategy}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
}

function renderError(message: string) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-destructive" />
          <CardTitle>Target Users</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

export function TargetUsers(props: TargetUsersProps) {
  return (
    <ErrorBoundary>
      <TargetUsersContent {...props} />
    </ErrorBoundary>
  );
} 