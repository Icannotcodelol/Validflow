import { z } from "zod"; import { BaseSectionSchema, ExecutiveSummarySchema } from "../schemas/sections"; import type { BaseSectionResponse } from "../types/sections";

// Map of section IDs to their corresponding Zod schemas
const sectionSchemas = {
  'executive-summary': ExecutiveSummarySchema,
} as const;

type SectionId = keyof typeof sectionSchemas;

/**
 * Validates a section response against its corresponding schema
 * @param sectionId The ID of the section to validate
 * @param data The data to validate
 * @returns A tuple containing:
 * 1. Whether the validation was successful
 * 2. The validated data if successful, or undefined if failed
 * 3. Any validation errors if failed
 */
export function validateSection<T extends BaseSectionResponse>(
  sectionId: SectionId,
  data: unknown
): [boolean, T | undefined, z.ZodError | undefined] {
  try {
    const schema = sectionSchemas[sectionId];
    if (!schema) {
      throw new Error(`No schema found for section ID: ${sectionId}`);
    }

    const validatedData = schema.parse(data) as T;
    return [true, validatedData, undefined];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return [false, undefined, error];
    }
    throw error;
  }
}

/**
 * Creates a fallback response for a section when validation fails
 * @param sectionId The ID of the section
 * @param error The error message
 * @returns A fallback response object
 */
export function createFallbackResponse(sectionId: SectionId, error: string): BaseSectionResponse {
  return {
    status: 'failed',
    error,
    sectionId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Type guard to check if a response is valid
 * @param response The response to check
 * @returns Whether the response is valid
 */
export function isValidResponse(response: unknown): response is BaseSectionResponse {
  try {
    BaseSectionSchema.parse(response);
    return true;
  } catch {
    return false;
  }
}
