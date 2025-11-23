import { z } from "zod";

/**
 * Menu item form schema - source of truth for menu item validation
 * This schema validates the form input structure
 */
export const menuItemFormSchema = z
  .object({
    category_id: z.string().uuid("Category is required"),
    name: z.string().min(1, "Name is required"),
    name_ar: z.string().optional(),
    description: z.string().optional(),
    description_ar: z.string().optional(),
    image_key: z.string().optional(),
    max_order_limit_unit: z.enum(["box", "gram"]).optional(),
    max_order_limit_value: z
      .string()
      .optional()
      .transform((val) => {
        if (!val || val.trim().length === 0) {
          return undefined;
        }
        const parsed = Number.parseInt(val, 10);
        return Number.isNaN(parsed) ? undefined : parsed;
      })
      .pipe(z.number().int().positive().optional()),
    availability: z.boolean().default(true),
    is_active: z.boolean().default(true),
    price_type: z.enum(["gram", "box"]).default("gram"),
    price_count: z
      .string()
      .default("1")
      .transform((val) => Number.parseInt(val, 10))
      .pipe(z.number().int().positive()),
    price_amount: z
      .string()
      .default("0")
      .transform((val) => Number.parseInt(val, 10))
      .pipe(z.number().int().nonnegative()),
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
  maxOrderLimitUnit: z.enum(["box", "gram"]).optional(),
  maxOrderLimitValue: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val.trim().length === 0) {
        return undefined;
      }
      const parsed = Number.parseInt(val, 10);
      return Number.isNaN(parsed) ? undefined : parsed;
    })
    .pipe(z.number().int().positive().optional()),
  imageKey: z
    .string()
    .optional()
    .transform((val) => (val && val.trim().length > 0 ? val : null)),
  priceType: z.enum(["gram", "box"]),
  priceCount: z
    .string()
    .transform((val) => Number.parseInt(val, 10))
    .pipe(z.number().int().positive()),
  priceAmount: z
    .string()
    .transform((val) => Number.parseInt(val, 10))
    .pipe(z.number().int().nonnegative()),
});

