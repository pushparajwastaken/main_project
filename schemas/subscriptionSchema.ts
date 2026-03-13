import { z } from "zod";

export const SUBSCRIPTION_PLANS = ["monthly", "quarterly", "annual"] as const;
export const SUBSCRIPTION_STATUSES = [
  "active",
  "expired",
  "cancelled",
] as const;
export const PAYMENT_GATEWAYS = ["razorpay", "stripe", "bmac"] as const;

export const subscriptionFormSchema = z.object({
  plan: z.enum(SUBSCRIPTION_PLANS, { message: "Please select a valid plan" }),
});

export const subscriptionCreateSchema = z.object({
  userId: z.string().min(1, "User ID is required"),

  plan: z.enum(SUBSCRIPTION_PLANS, { message: "Invalid plan" }),

  status: z.enum(SUBSCRIPTION_STATUSES).default("active"),

  amount: z.number().min(1, "Amount must be at least 1"),

  currency: z.string().default("INR"),

  gateway: z.enum(PAYMENT_GATEWAYS, { message: "Invalid payment gateway" }),

  gatewaySubId: z.string().optional(), // Razorpay subscription ID
  gatewayPayId: z.string().min(1, "Payment ID is required"),

  startedAt: z.date().default(new Date()),

  expiresAt: z.date(),
});

export const subscriptionCancelSchema = z.object({
  subscriptionId: z.string().min(1, "Subscription ID is required"),
  reason: z.string().max(500).optional(),
});
