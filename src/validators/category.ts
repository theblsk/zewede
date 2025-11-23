import { z } from "zod";

/**
 * Category form schema - source of truth for category validation
 * This schema validates the form input structure
 */
export const categoryFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    name_ar: z.string().optional(),
    description: z.string().optional(),
    description_ar: z.string().optional(),
    is_active: z.boolean().default(true),
  })
  .refine(
    (data) => {
      const hasDescription =
        data.description && data.description.trim().length > 0;
      const hasDescriptionAr =
        data.description_ar && data.description_ar.trim().length > 0;
      return hasDescription === hasDescriptionAr;
    },
    {
      message:
        "Both descriptions must be provided together, or both must be empty",
      path: ["description"],
    }
  );

/**
 * Type inferred from the category form schema
 */
export type CategoryFormInput = z.input<typeof categoryFormSchema>;

/**
 * Type inferred from the category form schema (output after validation)
 */
export type CategoryFormOutput = z.output<typeof categoryFormSchema>;

/**
 * Schema for server-side validation (maps form input to database structure)
 * This is used in server actions to validate and transform the data
 */
export const categoryServerSchema = z.object({
  name: z.string().min(1),
  description: z
    .string()
    .optional()
    .transform((val) => (val && val.trim().length > 0 ? val : null)),
  isActive: z.boolean(),
});

