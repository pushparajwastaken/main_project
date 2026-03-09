import mongoose, { Schema, Document } from "mongoose";
export interface Sheet extends Document {
  title: string;
  slug: string;
  description: string;
  isPremium: boolean;
  tags: [String];
  isPublished: Boolean;
  order: number;
  totalTopics: number;
}

const sheetSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unqiue: true,
      lowercase: true,
    },
    description: String,
    isPremium: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    isPublished: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    totalTopics: { type: Number, default: 0 },
  },
  { timestamps: true },
);
const SheetModel =
  (mongoose.models.Sheet as mongoose.Model<Sheet>) ||
  mongoose.model<Sheet>("Sheet", sheetSchema);
export default SheetModel;
