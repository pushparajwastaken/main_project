import z from "zod";
import { usernameValidation } from "./signUpSchema";
export const sponsorshipSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be atleast 2 characters")
    .max(50, "Name cannot be more than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name must only contain letters")
    .optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  amount: z.number().min(1, "Amount must be at least 1"),
  message: z
    .string()
    .max(500, "Message cannot be longer than 500 characters")
    .optional(),
  isAnon: z.boolean().default(false),
});

export const sponsorshipCompleteSchema = z.object({
  userId: z.string().optional(), // MongoDB ObjectId as string
  name: z.string().optional(),
  email: z.string().email().optional(),
  amount: z.number().min(1),
  currency: z.string().default("INR"),
  message: z.string().max(500).optional(),
  isAnon: z.boolean().default(false),
  gateway: z.enum(["razorpay", "stripe", "bmac"]),
  paymentId: z.string().min(1),
  paidAt: z.date().default(new Date()),
});
