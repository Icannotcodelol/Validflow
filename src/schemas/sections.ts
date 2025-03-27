import { z } from "zod";

// Base schema that all sections must implement
export const BaseSectionSchema = z.object({
  status: z.enum(['completed', 'failed']),
  error: z.string().optional(),
  sectionId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Executive Summary Schema
export const ExecutiveSummarySchema = BaseSectionSchema.extend({
  title: z.string().optional(),
  verdict: z.enum(['positive', 'negative', 'neutral']).optional(),
  score: z.number().min(0).max(100).optional(),
  summary: z.string().optional(),
  keyFindings: z.array(z.object({
    type: z.enum(['strength', 'weakness', 'opportunity', 'threat']),
    text: z.string(),
  })).optional(),
});
