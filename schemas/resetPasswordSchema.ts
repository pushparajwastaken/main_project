import z from "zod";
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must contain atleast 6 characters")
      .regex(/[A-Z]/, "Must contain one uppercase letter")
      .regex(/[0-9]/, "Must contain one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
