import mongoose, { Schema, Document } from "mongoose";

export interface Topic extends Document {
  sheetId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  order: number;
  totalQuestions: number;
  difficulty: string;
}

const topicSchema: Schema<Topic> = new Schema(
  {
    sheetId: {
      type: Schema.Types.ObjectId,
      ref: "Sheet",
      required: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "difficult"],
      default: "medium",
    },
  },
  { timestamps: true },
);
topicSchema.index({ subjectId: 1 });
topicSchema.index({ sheetId: 1 });
const topicModel =
  (mongoose.models.Topic as mongoose.Model<Topic>) ||
  mongoose.model<Topic>("Topic", topicSchema);

export default topicModel;
