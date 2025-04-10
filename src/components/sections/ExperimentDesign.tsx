import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from 'lucide-react';
import type { ExperimentDesign as ExperimentDesignData, BaseSectionResponse } from "@/lib/ai/models";

interface ExperimentDesignProps extends BaseSectionResponse {
  data?: ExperimentDesignData['data'];
}

export function ExperimentDesign({ status, error, data }: ExperimentDesignProps) {
  if (status === 'pending') {
    return <div>Loading Experiment Design...</div>;
  }

  if (status === 'failed') {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive"><AlertCircle className="mr-2" /> Experiment Design Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Could not generate the experiment design suggestions.</p>
          {error && <p className="text-sm text-muted-foreground mt-2">Error details: {error}</p>}
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const { mvpPrototypes, customerInterviewFramework, abTestingRecommendations } = data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Experiment Design</CardTitle>
        <CardDescription>Low-cost methods to test your riskiest assumptions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>MVP / Prototype Ideas ({mvpPrototypes.length})</AccordionTrigger>
            <AccordionContent className="space-y-4">
              {mvpPrototypes.map((mvp: { type: string; description: string; assumptionsTested: string[]; }, index: number) => (
                <div key={index} className="p-3 border rounded-md bg-muted/40">
                  <h4 className="font-semibold mb-1">{mvp.type}</h4>
                  <p className="text-sm mb-2">{mvp.description}</p>
                  <p className="text-xs font-medium text-muted-foreground">Assumptions Tested:</p>
                  <ul className="list-disc list-inside text-xs text-muted-foreground">
                    {mvp.assumptionsTested.map((assumption: string, i: number) => <li key={i}>{assumption}</li>)}
                  </ul>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Customer Interview Framework</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div>
                 <h4 className="font-semibold mb-1">Purpose</h4>
                 <p className="text-sm text-muted-foreground">{customerInterviewFramework.purpose}</p>
              </div>
              <div>
                  <h4 className="font-semibold mb-1">Key Questions</h4>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {customerInterviewFramework.keyQuestions.map((q: string, index: number) => <li key={index}>{q}</li>)}
                  </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          {abTestingRecommendations.length > 0 && (
            <AccordionItem value="item-3">
              <AccordionTrigger>A/B Testing Recommendations ({abTestingRecommendations.length})</AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Feature/Message</TableHead>
                      <TableHead>Variants</TableHead>
                      <TableHead>Success Metric</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {abTestingRecommendations.map((test: { featureOrMessage: string; variants: string[]; successMetric: string; }, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{test.featureOrMessage}</TableCell>
                        <TableCell>{test.variants.join(' vs. ')}</TableCell>
                        <TableCell>{test.successMetric}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
} 