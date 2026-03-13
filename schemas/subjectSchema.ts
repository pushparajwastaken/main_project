import z from "zod";
export const subjectSchema = z.object({
  sheetId: z.string().min(1, "SheetId is required"),
  title: z
    .string()
    .min(3, "Title is required")
    .max(100, "Title cannot be more than 100 characters"),
  slug: z
    .string()
    .min(3, "Slug cannot be empty")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers and hyphens",
    ),
  order: z.number().min(0).default(0),
});
