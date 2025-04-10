import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import type { ValidationRoadmap as ValidationRoadmapData, BaseSectionResponse } from "@/lib/ai/models"; // Assuming type export

interface ValidationRoadmapProps extends BaseSectionResponse {
  data?: ValidationRoadmapData['data']; // Use the correct type for the data prop
}

const priorityBadgeVariant = (priority: 'high' | 'medium' | 'low') => {
  switch (priority) {
    case 'high': return 'destructive';
    case 'medium': return 'secondary';
    case 'low': return 'outline';
    default: return 'outline';
  }
};

export function ValidationRoadmap({ status, error, data }: ValidationRoadmapProps) {
  if (status === 'pending') {
    return <div>Loading Validation Roadmap...</div>;
  }

  if (status === 'failed') {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive"><AlertCircle className="mr-2" /> Validation Roadmap Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Could not generate the validation roadmap.</p>
          {error && <p className="text-sm text-muted-foreground mt-2">Error details: {error}</p>}
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null; // Or some placeholder if data is missing but status is completed
  }

  const { coreHypotheses, hypothesisExperiments, validationTimeline } = data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Validation Roadmap</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>Core Hypotheses ({coreHypotheses.length})</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-2 pl-5">
                {coreHypotheses.map((item: { hypothesis: string; priority: 'high' | 'medium' | 'low'; }, index: number) => (
                  <li key={index} className="flex items-center justify-between">
                    <span>{item.hypothesis}</span>
                    <Badge variant={priorityBadgeVariant(item.priority)}>{item.priority}</Badge>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Hypothesis Experiments ({hypothesisExperiments.length})</AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hypothesis</TableHead>
                    <TableHead>Experiment</TableHead>
                    <TableHead>Success Metric</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hypothesisExperiments.map((exp: { hypothesis: string; experiment: string; successMetric: string; }, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{exp.hypothesis}</TableCell>
                      <TableCell>{exp.experiment}</TableCell>
                      <TableCell>{exp.successMetric}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Validation Timeline</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">First 30 Days</h4>
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {validationTimeline.days30.map((goal: string, index: number) => <li key={index}>{goal}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Days 31-60</h4>
                 <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {validationTimeline.days60.map((goal: string, index: number) => <li key={index}>{goal}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Days 61-90</h4>
                 <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {validationTimeline.days90.map((goal: string, index: number) => <li key={index}>{goal}</li>)}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
} 