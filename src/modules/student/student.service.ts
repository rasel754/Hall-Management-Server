import { User } from "./student.model";
import { Room } from "../room/room.model";
import { Booking } from "../booking/booking.model";
import { Complaint } from "../complaint/complaint.model";
import { Notice } from "../notice/notice.model";
import { Payment } from "../payment/payment.model";
import { ApiError } from "../../utils/ApiError";
import mongoose from "mongoose";

export const getProfile = async (studentId: string) => {
  const student = await User.findById(studentId);
  if (!student) {
    throw new ApiError(404, "Student profile not found");
  }
  return student;
};

export const updateProfile = async (studentId: string, data: any) => {
  const student = await User.findByIdAndUpdate(studentId, { $set: data }, { new: true });
  if (!student) {
    throw new ApiError(404, "Student profile not found");
  }
  return student;
};

export const getCurrentRoom = async (studentId: string) => {
  const activeBooking = await Booking.findOne({
    student: studentId,
    status: { $in: ["approved", "active"] },
  }).populate("room");

  return activeBooking ? activeBooking.room : null;
};

export const getBookings = async (studentId: string) => {
  return Booking.find({ student: studentId }).populate("room").sort({ createdAt: -1 });
};

export const createBookingRequest = async (studentId: string, roomId: string, moveInDate: Date) => {
  if (!mongoose.isValidObjectId(roomId)) {
    throw new ApiError(400, "Invalid Room ID");
  }

  const existingBooking = await Booking.findOne({
    student: studentId,
    status: { $in: ["pending", "approved", "active"] },
  });

  if (existingBooking) {
    throw new ApiError(400, "You already have a pending or active booking request");
  }

  const room = await Room.findById(roomId);
  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  if (room.status === "full" || room.status === "maintenance" || room.currentOccupancy >= room.capacity) {
    throw new ApiError(400, "Room is full or currently under maintenance");
  }

  const booking = await Booking.create({
    student: studentId,
    room: roomId,
    moveInDate,
    status: "pending",
  });

  return booking;
};

export const cancelBooking = async (studentId: string, bookingId: string) => {
  if (!mongoose.isValidObjectId(bookingId)) {
    throw new ApiError(400, "Invalid Booking ID");
  }

  const booking = await Booking.findOne({ _id: bookingId, student: studentId });
  if (!booking) {
    throw new ApiError(404, "Booking request not found");
  }

  if (booking.status !== "pending") {
    throw new ApiError(400, "Only pending bookings can be cancelled");
  }

  booking.status = "cancelled";
  booking.cancellationDate = new Date();
  booking.cancellationReason = "Cancelled by student";
  await booking.save();

  return booking;
};

export const getComplaints = async (studentId: string, filter: any, page: number, limit: number, skip: number) => {
  const query = { student: studentId, ...filter };
  const total = await Complaint.countDocuments(query);
  const data = await Complaint.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
  return { data, total };
};

export const createComplaint = async (studentId: string, data: any) => {
  const complaint = await Complaint.create({
    student: studentId,
    ...data,
    status: "pending",
  });
  return complaint;
};

export const getComplaintById = async (studentId: string, complaintId: string) => {
  if (!mongoose.isValidObjectId(complaintId)) {
    throw new ApiError(400, "Invalid Complaint ID");
  }
  const complaint = await Complaint.findOne({ _id: complaintId, student: studentId }).populate("resolvedBy", "name email");
  if (!complaint) {
    throw new ApiError(404, "Complaint not found");
  }
  return complaint;
};

export const getActiveNotices = async (filter: any, page: number, limit: number, skip: number) => {
  const query = { isActive: true, ...filter };
  const total = await Notice.countDocuments(query);
  const data = await Notice.find(query).populate("publishedBy", "name avatar").sort({ publishDate: -1 }).skip(skip).limit(limit);
  return { data, total };
};

export const getNoticeById = async (noticeId: string) => {
  if (!mongoose.isValidObjectId(noticeId)) {
    throw new ApiError(400, "Invalid Notice ID");
  }
  const notice = await Notice.findOne({ _id: noticeId, isActive: true }).populate("publishedBy", "name avatar");
  if (!notice) {
    throw new ApiError(404, "Notice not found");
  }
  return notice;
};

export const getPayments = async (studentId: string, page: number, limit: number, skip: number) => {
  const query = { student: studentId };
  const total = await Payment.countDocuments(query);
  const data = await Payment.find(query).populate({ path: "booking", populate: { path: "room" } }).sort({ createdAt: -1 }).skip(skip).limit(limit);
  return { data, total };
};

export const makePayment = async (studentId: string, paymentId: string) => {
  if (!mongoose.isValidObjectId(paymentId)) {
    throw new ApiError(400, "Invalid Payment ID");
  }

  const payment = await Payment.findOne({ _id: paymentId, student: studentId });
  if (!payment) {
    throw new ApiError(404, "Payment record not found");
  }

  if (payment.status === "paid") {
    throw new ApiError(400, "Payment has already been paid");
  }

  payment.status = "paid";
  payment.paidAt = new Date();
  payment.transactionId = `TXN-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
  await payment.save();

  return payment;
};

export const deleteComplaint = async (studentId: string, complaintId: string) => {
  if (!mongoose.isValidObjectId(complaintId)) {
    throw new ApiError(400, "Invalid Complaint ID");
  }
  const complaint = await Complaint.findOneAndDelete({ _id: complaintId, student: studentId });
  if (!complaint) {
    throw new ApiError(404, "Complaint not found or unauthorized");
  }
  return complaint;
};

export default {
  getProfile,
  updateProfile,
  getCurrentRoom,
  getBookings,
  createBookingRequest,
  cancelBooking,
  getComplaints,
  createComplaint,
  getComplaintById,
  deleteComplaint,
  getActiveNotices,
  getNoticeById,
  getPayments,
  makePayment,
};
