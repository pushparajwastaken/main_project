import z from "zod";
import { usernameValidation } from "./signUpSchema";
export const profileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  college: z.string().min(2).max(100).optional(),
  gradYear: z.number().min(2024).max(2028).optional(),
  username: usernameValidation.optional(),
});
