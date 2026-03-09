import mongoose, { Schema, Document } from "mongoose";

export interface Subject extends Document {
  sheetId: Schema.Types.ObjectId;
  title: string;
  slug: string;
  order: number;
  totalTopics: number;
}
const subjectSchema: Schema<Subject> = new Schema(
  {
    sheetId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    totalTopics: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);
subjectSchema.index({ sheetId: 1, order: 1 });
const SubjectModel =
  (mongoose.models.Subject as mongoose.Model<Subject>) ||
  mongoose.model<Subject>("Subject", subjectSchema);

export default SubjectModel;
