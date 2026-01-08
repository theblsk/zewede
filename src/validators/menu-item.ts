import { z } from "zod";

/**
 * Menu item form schema - source of truth for menu item validation
 * This schema validates the form input structure
 */
const menuItemSizeSchema = z.object({
  id: z.string().optional(), // For updates, to track which size is being edited
  name: z.string().min(1, "Size name is required"),
  name_ar: z.string().optional(),
  price: z
    .string()
    .default("0")
    .transform((val) => Number.parseInt(val, 10))
    .pipe(z.number().int().nonnegative()),
  is_active: z.boolean().default(true),
});

export const menuItemFormSchema = z
  .object({
    category_id: z.string().uuid("Category is required"),
    name: z.string().min(1, "Name is required"),
    name_ar: z.string().optional(),
    description: z.string().optional(),
    description_ar: z.string().optional(),
    image_key: z.string().optional(),
    availability: z.boolean().default(true),
    is_active: z.boolean().default(true),
    sizes: z.array(menuItemSizeSchema).min(1, "At least one size is required"),
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
 * Type inferred from the menu item form schema
 */
export type MenuItemFormInput = z.input<typeof menuItemFormSchema>;

/**
 * Type inferred from the menu item form schema (output after validation)
 */
export type MenuItemFormOutput = z.output<typeof menuItemFormSchema>;

const menuItemSizeServerSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  nameAr: z.string().optional(),
  price: z
    .string()
    .transform((val) => Number.parseInt(val, 10))
    .pipe(z.number().int().nonnegative()),
  isActive: z.boolean(),
});

/**
 * Schema for server-side validation (maps form input to database structure)
 * This is used in server actions to validate and transform the data
 */
export const menuItemServerSchema = z.object({
  categoryId: z.uuid(),
  name: z.string().min(1),
  description: z
    .string()
    .optional()
    .transform((val) => (val && val.trim().length > 0 ? val : null)),
  availability: z.boolean(),
  isActive: z.boolean(),
  imageKey: z
    .string()
    .optional()
    .transform((val) => (val && val.trim().length > 0 ? val : null)),
  sizes: z.array(menuItemSizeServerSchema).min(1),
});

