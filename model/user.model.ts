import mongoose, { Schema, Document } from "mongoose";

//subscription is directly embedded into the user to avoid a join for every auth check

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  emailVerified: boolean;
  verifyToken: string;
  verifyTokenExpiry: Date;
  college: string;
  gradYear: number;
  subscription: {
    status: string;
    plan: string;
    startedAt: string;
    expiresAt: string;
    paymentId: string;
  };
  resetPasswordToken: string;
  resetPasswordExpiry: Date;
}

const userSchema: Schema<User> = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please enter a valid Email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    verifyToken: {
      type: String,
    },
    verifyTokenExpiry: {
      type: Date,
    },

    college: {
      type: String,
    },
    gradYear: {
      type: Number,
    },
    subscription: {
      status: {
        type: String,
        enum: ["Active", "Expired", "Free"],
        default: "Free",
      },
      plan: String,
      startedAt: Date,
      expiresAt: Date,
      paymentId: String,
    },
    resetPasswordToken: { type: String },
    resetPasswordExpiry: { type: Date },
  },
  {
    timestamps: true,
  },
);
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default UserModel;
