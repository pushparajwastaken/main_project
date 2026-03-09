//this subscription model only exists for payments history
import mongoose, { Schema, Document } from "mongoose";

export interface Subscription extends Document {
  userId: Schema.Types.ObjectId;
  plan: string;
  status: string;
  amount: number;
  currency: string;
  gateway: string;
  gatewaySubId: string;
  gatewayPayId: string;
  startedAt: Date;
  expiresAt: Date;
  cancelledAt: Date;
}
const subscriptionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: String, enum: ["monthly", "quarterly", "annual"] },
    status: { type: String, enum: ["active", "expired", "cancelled"] },
    amount: Number,
    currency: { type: String, default: "INR" },
    gateway: { type: String, enum: ["razorpay", "stripe"] },
    gatewaySubId: String,
    gatewayPayId: String,
    startedAt: Date,
    expiresAt: Date,
    cancelledAt: Date,
  },
  { timestamps: true },
);

const SubscriptionModel =
  (mongoose.models.Subscription as mongoose.Model<Subscription>) ||
  mongoose.model<Subscription>("Subscription", subscriptionSchema);

export default SubscriptionModel;
