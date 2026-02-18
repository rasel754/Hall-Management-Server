import mongoose, { Schema, type Document } from "mongoose"

export interface IRoom extends Document {
  number: string
  capacity: number
  occupied: number
  available: boolean
  createdAt: Date
}

const roomSchema = new Schema<IRoom>(
  {
    number: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true },
    occupied: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export const Room = mongoose.model<IRoom>("Room", roomSchema)
