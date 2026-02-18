import mongoose, { Schema, type Document } from "mongoose"

export interface IPayment extends Document {
  studentId: mongoose.Types.ObjectId
  amount: number
  month: string
  status: "Pending" | "Paid"
  createdAt: Date
}

const paymentSchema = new Schema<IPayment>(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, default: 1100 },
    month: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema)
