import mongoose, { Schema, type Document } from "mongoose"

export interface INotice extends Document {
  title: string
  content: string
  createdAt: Date
}

const noticeSchema = new Schema<INotice>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export const Notice = mongoose.model<INotice>("Notice", noticeSchema)
