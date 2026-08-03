import { z } from "zod";

export const apiErrorDetailSchema = z.object({
  code: z.string(),
  message: z.string(),
  path: z.array(z.union([z.string(), z.number()])).optional()
});

export function apiResponseSchema<TSchema extends z.ZodTypeAny>(dataSchema: TSchema) {
  return z.object({
    data: dataSchema.nullable(),
    errors: z.array(apiErrorDetailSchema).nullable(),
    message: z.string(),
    meta: z.record(z.unknown()),
    success: z.boolean()
  });
}
