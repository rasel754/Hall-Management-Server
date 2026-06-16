import { Document, Types } from "mongoose";

export interface IPayment {
  _id: Types.ObjectId;
  student: Types.ObjectId;
  booking: Types.ObjectId;
  amount: number;
  month: string;
  status: "pending" | "paid" | "overdue";
  paidAt?: Date;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IPaymentDocument = IPayment & Document;
