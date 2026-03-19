import { Schema, Document } from "mongoose";
import mongoose from "mongoose";

export interface UserTopicProgress extends Document {
  userId: mongoose.Types.ObjectId;
  topicId: mongoose.Types.ObjectId;
  sheetId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  isCompleted: boolean;
  completedAt: Date;
  completedQuestions: [mongoose.Types.ObjectId];
  revisitCount: number;
}
const UserTopicProgressSchema: Schema<UserTopicProgress> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    topicId: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
    sheetId: { type: Schema.Types.ObjectId, ref: "Sheet", required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    isCompleted: { type: Boolean, default: false },
    completedAt: Date,
    completedQuestions: [Schema.Types.ObjectId],
    revisitCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

UserTopicProgressSchema.index({ userId: 1, topicId: 1 }, { unique: true });
UserTopicProgressSchema.index({ userId: 1, sheetId: 1 });
UserTopicProgressSchema.index({ userId: 1, subjectId: 1 });

const UserTopicProgressModel =
  (mongoose.models.UserTopicProgress as mongoose.Model<UserTopicProgress>) ||
  mongoose.model<UserTopicProgress>(
    "UserTopicProgress",
    UserTopicProgressSchema,
  );
export default UserTopicProgressModel;
