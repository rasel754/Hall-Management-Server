import { Document, Types } from "mongoose";

export interface IBooking {
  _id: Types.ObjectId;
  student: Types.ObjectId;
  room: Types.ObjectId;
  status: "pending" | "approved" | "rejected" | "cancelled" | "active";
  requestDate: Date;
  approvalDate?: Date;
  approvedBy?: Types.ObjectId;
  cancellationReason?: string;
  cancellationDate?: Date;
  moveInDate?: Date;
  moveOutDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type IBookingDocument = IBooking & Document;
