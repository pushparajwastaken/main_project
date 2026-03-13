import z from "zod";

export const questionSchema = z.object({
  topicId: z.string().min(1, "Topic id is required"),
  title: z.string().min(1, "Title is required").max(200),
  type: z.enum(["problem", "article", "video", "note"]).default("problem"),
  url: z.url().min(1, "URL is required"),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  platform: z
    .enum(["leetcode", "gfg", "codeforces", "youtube", "other"])
    .optional(),
  order: z.number().min(0).default(0),
  isPremium: z.boolean().default(false),
});
