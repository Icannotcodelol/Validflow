import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle, Info } from 'lucide-react';
import type { KeyPerformanceIndicators as KpiData, BaseSectionResponse } from "@/lib/ai/models";

interface KeyPerformanceIndicatorsProps extends BaseSectionResponse {
  data?: KpiData['data'];
}

export function KeyPerformanceIndicators({ status, error, data }: KeyPerformanceIndicatorsProps) {
  if (status === 'pending') {
    return <div>Loading Key Performance Indicators...</div>;
  }

  if (status === 'failed') {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive"><AlertCircle className="mr-2" /> Key Performance Indicators Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Could not generate the key performance indicators.</p>
          {error && <p className="text-sm text-muted-foreground mt-2">Error details: {error}</p>}
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const { criticalMetrics, measurementMethods } = data;
  const measurementMap = measurementMethods.reduce((acc: Record<string, typeof measurementMethods[number]>, method: typeof measurementMethods[number]) => {
    acc[method.metric] = method;
    return acc;
  }, {} as Record<string, typeof measurementMethods[number]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Performance Indicators (Validation Phase)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead>Target Value</TableHead>
              <TableHead>Timeframe</TableHead>
              <TableHead>Tracking Method & Tools</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {criticalMetrics.map((metric: { metric: string; description: string; targetValue: string; timeframe: string; }, index: number) => {
              const measurement = measurementMap[metric.metric];
              return (
                <TableRow key={index}>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center cursor-help">
                          {metric.metric}
                          <Info className="ml-1 h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{metric.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>{metric.targetValue}</TableCell>
                  <TableCell>{metric.timeframe}</TableCell>
                  <TableCell>
                    {measurement ? (
                      <>
                        <p>{measurement.method}</p>
                        {measurement.tools.length > 0 && (
                           <p className="text-xs text-muted-foreground">Tools: {measurement.tools.join(', ')}</p>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">No method specified</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 