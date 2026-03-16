import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be atleast 2 characters")
  .max(20, "Username must be no more than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters");

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be atleast 2 characters")
    .max(50, "Name cannot be more than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name must only contain letters"),
  username: usernameValidation,
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 letters" })
    .regex(/[A-Z]/, "Must contain atleast one upper length character")
    .regex(/[0-9]/, "Must contain atleast one number"),
  college: z
    .string()
    .min(2, "College name must be atleast 2 characters")
    .max(100, "College name cannot be more than 100 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "College name must not contain special characters",
    )
    .optional(),
  gradYear: z
    .number()
    .min(new Date().getFullYear(), "Invalid Graduation year")
    .max(new Date().getFullYear() + 4, "Invalid Graduation Year")
    .optional(),
});
