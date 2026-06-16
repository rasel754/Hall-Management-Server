import mongoose, { Schema } from "mongoose";
import { INoticeDocument } from "./notice.types";

const noticeSchema = new Schema<INoticeDocument>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [150, "Title must be less than 150 characters"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      minlength: [20, "Content must be at least 20 characters"],
      maxlength: [5000, "Content must be less than 5000 characters"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["general", "urgent", "academic", "maintenance"],
      required: [true, "Category is required"],
    },
    publishedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Publisher reference is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Notice = mongoose.model<INoticeDocument>("Notice", noticeSchema);
export default Notice;
