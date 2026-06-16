import mongoose, { Schema } from "mongoose";
import { IPaymentDocument } from "./payment.types";

const paymentSchema = new Schema<IPaymentDocument>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student reference is required"],
    },
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking reference is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    month: {
      type: String,
      required: [true, "Month is required"],
    },
    status: {
      type: String,
      enum: ["pending", "paid", "overdue"],
      default: "pending",
    },
    paidAt: {
      type: Date,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Payment = mongoose.model<IPaymentDocument>("Payment", paymentSchema);
export default Payment;
