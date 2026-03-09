import mongoose, { Schema, Document } from "mongoose";

export interface Sponsorship extends Document {
  userId: Schema.Types.ObjectId;
  name: string;
  email: string;
  amount: number;
  currency: number;
  message: string;
  isAnon: boolean;
  gateway: string;
  paymentId: string;
  paidAt: Date;
}
const sponsorshipSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" }, // null if anonymous
    name: String,
    email: String,
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    message: String,
    isAnon: { type: Boolean, default: false },
    gateway: { type: String, enum: ["razorpay", "stripe", "bmac"] },
    paymentId: String,
    paidAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);
const SponsorshipModel =
  (mongoose.models.Sponsorship as mongoose.Model<Sponsorship>) ||
  mongoose.model<Sponsorship>("Sponsorship", sponsorshipSchema);
export default SponsorshipModel;
