import { Payment } from "./payment.model";
import { ApiError } from "../../utils/ApiError";
import mongoose from "mongoose";

export const getPayments = async (filter: any, page: number, limit: number, skip: number) => {
  const query: any = {};
  if (filter.status) {
    query.status = filter.status;
  }
  if (filter.month) {
    query.month = filter.month;
  }

  const total = await Payment.countDocuments(query);
  const data = await Payment.find(query)
    .populate("student", "name email studentId avatar department year phone")
    .populate({
      path: "booking",
      populate: { path: "room" },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return { data, total };
};

export const updatePaymentStatus = async (paymentId: string, status: "pending" | "paid" | "overdue") => {
  if (!mongoose.isValidObjectId(paymentId)) {
    throw new ApiError(400, "Invalid Payment ID");
  }

  const payment = await Payment.findById(paymentId);
  if (!payment) {
    throw new ApiError(404, "Payment record not found");
  }

  payment.status = status;

  if (status === "paid") {
    payment.paidAt = new Date();
    if (!payment.transactionId) {
      payment.transactionId = `TXN-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
    }
  } else {
    payment.paidAt = undefined;
    payment.transactionId = undefined;
  }

  await payment.save();
  return payment;
};

export default {
  getPayments,
  updatePaymentStatus,
};
