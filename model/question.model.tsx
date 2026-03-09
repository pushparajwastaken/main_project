import mongoose, { Schema, Document, mongo } from "mongoose";

export interface Question extends Document {
  topicId: Schema.Types.ObjectId;
  title: string;
  type: String;
  url: string;
  difficulty: string;
  platform: string;
  order: number;
  isPremium: boolean;
  tags: [String];
}
const questionSchema: Schema<Question> = new Schema(
  {
    topicId: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["problem", "article", "video", "note"],
      default: "problem",
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
    },
    platform: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    tags: { String },
  },
  { timestamps: true },
);

const questionModel =
  (mongoose.models.Question as mongoose.Model<Question>) ||
  mongoose.model<Question>("Question", questionSchema);
export default questionModel;
