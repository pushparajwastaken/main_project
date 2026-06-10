import { z } from "zod";
import { usernameValidation } from "./signUpSchema";

export const profileSchema = z.object({
  username: usernameValidation.optional(),
  college: z
    .string()
    .min(2, "College name must be atleast 2 characters")
    .max(100, "College name cannot be more than 100 characters")
    .optional(),
  gradYear: z
    .number()
    .min(new Date().getFullYear(), "Invalid Graduation year")
    .max(new Date().getFullYear() + 4, "Invalid Graduation Year")
    .optional(),
});
