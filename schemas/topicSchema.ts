import z from "zod";
export const topicSchema = z.object({
  title: z.string().min(2).max(100),
  subjectId: z.string().min(1, "Subject is required"),
  sheetId: z.string().min(1, "Sheet is required"),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  order: z.number().min(0).default(0),
  description: z.string().max(500).optional(),
});
