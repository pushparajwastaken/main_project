import mongoose, { Schema, Document } from "mongoose";

export interface userSheetProgress extends Document {
  userId: Schema.Types.ObjectId;
  sheetId: Schema.Types.ObjectId;
  enrolledAt: Date;
  totalTopics: number;
  completedTopics: number;
  progressPercent: number;
  subjectProgress: [
    {
      subjectId: Schema.Types.ObjectId;
      total: number;
      completedTopics: number;
      progressPercent: number;
    },
  ];
  lastActivity: Date;
}
const userSheetProgressSchema: Schema<userSheetProgress> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sheetId: { type: Schema.Types.ObjectId, ref: "Sheet", required: true },
    enrolledAt: { type: Date, default: Date.now },
    totalTopics: Number,
    completedTopics: { type: Number, default: 0 },
    progressPercent: { type: Number, default: 0 },
    subjectProgress: [
      {
        subjectId: Schema.Types.ObjectId,
        totalTopics: Number,
        completedTopics: { type: Number, default: 0 },
        progressPercent: { type: Number, default: 0 },
      },
    ],
    lastActivity: Date,
  },
  { timestamps: true },
);

userSheetProgressSchema.index({ userId: 1, sheetId: 1 }, { unique: true });

const userSheetProgressModel =
  (mongoose.models.UserSheetProgress as mongoose.Model<userSheetProgress>) ||
  mongoose.model<userSheetProgress>(
    "UserSheetProgress",
    userSheetProgressSchema,
  );
