import mongoose, { Schema, type Document } from "mongoose"

export interface IComplaint extends Document {
  title: string
  description: string
  status: "Pending" | "Solved"
  studentId: mongoose.Types.ObjectId
  createdAt: Date
}

const complaintSchema = new Schema<IComplaint>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Solved"], default: "Pending" },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export const Complaint = mongoose.model<IComplaint>("Complaint", complaintSchema)
