import { Booking } from "./booking.model";
import { Room } from "../room/room.model";
import { User } from "../student/student.model";
import { Payment } from "../payment/payment.model";
import { ApiError } from "../../utils/ApiError";
import mongoose from "mongoose";

export const getBookings = async (filter: any, page: number, limit: number, skip: number) => {
  const query: any = {};

  if (filter.status) {
    query.status = filter.status;
  }

  if (filter.search) {
    const students = await User.find({
      name: { $regex: filter.search, $options: "i" },
    }).select("_id");
    const studentIds = students.map((s) => s._id);
    query.student = { $in: studentIds };
  }

  const total = await Booking.countDocuments(query);
  const data = await Booking.find(query)
    .populate("student", "name email studentId avatar department year phone")
    .populate("room")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return { data, total };
};

export const approveBooking = async (bookingId: string, adminId: string) => {
  if (!mongoose.isValidObjectId(bookingId)) {
    throw new ApiError(400, "Invalid Booking ID");
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, "Booking request not found");
  }

  if (booking.status !== "pending") {
    throw new ApiError(400, `Booking is already ${booking.status}`);
  }

  const roomField = booking.room || booking.get('roomId');
  const room = await Room.findById(roomField);
  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  if (room.currentOccupancy >= room.capacity) {
    room.status = "full";
    await room.save();
    throw new ApiError(400, "Room is already full");
  }

  booking.status = "approved";
  booking.approvalDate = new Date();
  booking.approvedBy = new mongoose.Types.ObjectId(adminId);
  booking.moveInDate = new Date();

  // Handle old schema database compatibility
  if (!booking.student && booking.get('studentId')) {
    booking.student = booking.get('studentId');
  }
  if (!booking.room && booking.get('roomId')) {
    booking.room = booking.get('roomId');
  }
  if (!booking.moveInDate && booking.get('startDate')) {
    booking.moveInDate = booking.get('startDate');
  }

  await booking.save();

  room.currentOccupancy += 1;
  if (room.currentOccupancy >= room.capacity) {
    room.status = "full";
  } else {
    room.status = "occupied";
  }
  await room.save();

  const monthString = new Date().toISOString().substring(0, 7);
  await Payment.create({
    student: booking.student,
    booking: booking._id,
    amount: room.pricePerMonth,
    month: monthString,
    status: "pending",
  });

  return booking;
};

export const rejectBooking = async (bookingId: string, reason: string, adminId: string) => {
  if (!mongoose.isValidObjectId(bookingId)) {
    throw new ApiError(400, "Invalid Booking ID");
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, "Booking request not found");
  }

  if (booking.status !== "pending") {
    throw new ApiError(400, `Booking is already ${booking.status}`);
  }

  booking.status = "rejected";
  booking.approvedBy = new mongoose.Types.ObjectId(adminId);
  booking.approvalDate = new Date();
  booking.cancellationReason = reason;
  booking.cancellationDate = new Date();

  // Handle old schema database compatibility
  if (!booking.student && booking.get('studentId')) {
    booking.student = booking.get('studentId');
  }
  if (!booking.room && booking.get('roomId')) {
    booking.room = booking.get('roomId');
  }
  if (!booking.moveInDate && booking.get('startDate')) {
    booking.moveInDate = booking.get('startDate');
  }

  await booking.save();

  return booking;
};

export default {
  getBookings,
  approveBooking,
  rejectBooking,
};
