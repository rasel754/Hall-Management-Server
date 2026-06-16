import mongoose, { Schema } from "mongoose";
import { IBookingDocument } from "./booking.types";

const bookingSchema = new Schema<IBookingDocument>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student reference is required"],
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Room reference is required"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled", "active"],
      default: "pending",
    },
    requestDate: {
      type: Date,
      default: Date.now,
    },
    approvalDate: {
      type: Date,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    cancellationReason: {
      type: String,
      default: "",
    },
    cancellationDate: {
      type: Date,
    },
    moveInDate: {
      type: Date,
    },
    moveOutDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Booking = mongoose.model<IBookingDocument>("Booking", bookingSchema);
export default Booking;
