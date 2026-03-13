import z from "zod";

export const sheetSchemaValidation = z.object({
  title: z
    .string()
    .min(3, "Title must be 3 characters")
    .max(100, "Title cannot be more than 100 characters"),
  slug: z
    .string()
    .min(3, "Slug cannot be empty")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers and hyphens",
    ),
  description: z
    .string()
    .max(500, "Description cannot be more than 500 characters")
    .optional(),
  isPremium: z.boolean().default(false),
});
