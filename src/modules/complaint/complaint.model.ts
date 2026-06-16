import mongoose, { Schema } from "mongoose";
import { IComplaintDocument } from "./complaint.types";

const complaintSchema = new Schema<IComplaintDocument>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student reference is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [100, "Title must be less than 100 characters"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["maintenance", "noise", "cleanliness", "security", "other"],
      required: [true, "Category is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [20, "Description must be at least 20 characters"],
      maxlength: [1000, "Description must be less than 1000 characters"],
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved"],
      default: "pending",
    },
    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    resolvedAt: {
      type: Date,
    },
    adminNote: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Complaint = mongoose.model<IComplaintDocument>("Complaint", complaintSchema);
export default Complaint;
