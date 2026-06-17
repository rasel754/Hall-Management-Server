"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComplaint = exports.makePayment = exports.getPayments = exports.getNoticeById = exports.getActiveNotices = exports.getComplaintById = exports.createComplaint = exports.getComplaints = exports.cancelBooking = exports.createBookingRequest = exports.getBookings = exports.getCurrentRoom = exports.updateProfile = exports.getProfile = void 0;
const student_model_1 = require("./student.model");
const room_model_1 = require("../room/room.model");
const booking_model_1 = require("../booking/booking.model");
const complaint_model_1 = require("../complaint/complaint.model");
const notice_model_1 = require("../notice/notice.model");
const payment_model_1 = require("../payment/payment.model");
const ApiError_1 = require("../../utils/ApiError");
const mongoose_1 = __importDefault(require("mongoose"));
const getProfile = async (studentId) => {
    const student = await student_model_1.User.findById(studentId);
    if (!student) {
        throw new ApiError_1.ApiError(404, "Student profile not found");
    }
    return student;
};
exports.getProfile = getProfile;
const updateProfile = async (studentId, data) => {
    const student = await student_model_1.User.findByIdAndUpdate(studentId, { $set: data }, { new: true });
    if (!student) {
        throw new ApiError_1.ApiError(404, "Student profile not found");
    }
    return student;
};
exports.updateProfile = updateProfile;
const getCurrentRoom = async (studentId) => {
    const activeBooking = await booking_model_1.Booking.findOne({
        student: studentId,
        status: { $in: ["approved", "active"] },
    }).populate("room");
    if (!activeBooking || !activeBooking.room)
        return null;
    const room = activeBooking.room;
    const roomId = room._id || room;
    // Fetch roommates (other students who have approved or active bookings in the same room)
    const roommatesBookings = await booking_model_1.Booking.find({
        room: roomId,
        status: { $in: ["approved", "active"] },
        student: { $ne: studentId }, // Exclude current student
    }).populate("student", "name email avatar studentId department year phone");
    const roommates = roommatesBookings
        .map((b) => b.student)
        .filter((s) => s !== null && s !== undefined);
    const roomObj = room.toObject ? room.toObject() : room;
    return {
        ...roomObj,
        roommates,
        allocationDate: activeBooking.approvalDate || activeBooking.createdAt || activeBooking.moveInDate || activeBooking.get("startDate"),
        activeBookingId: activeBooking._id,
    };
};
exports.getCurrentRoom = getCurrentRoom;
const getBookings = async (studentId) => {
    return booking_model_1.Booking.find({ student: studentId }).populate("room").sort({ createdAt: -1 });
};
exports.getBookings = getBookings;
const createBookingRequest = async (studentId, roomId, moveInDate) => {
    if (!mongoose_1.default.isValidObjectId(roomId)) {
        throw new ApiError_1.ApiError(400, "Invalid Room ID");
    }
    const existingBooking = await booking_model_1.Booking.findOne({
        student: studentId,
        status: { $in: ["pending", "approved", "active"] },
    });
    if (existingBooking) {
        throw new ApiError_1.ApiError(400, "You already have a pending or active booking request");
    }
    const room = await room_model_1.Room.findById(roomId);
    if (!room) {
        throw new ApiError_1.ApiError(404, "Room not found");
    }
    if (room.status === "full" || room.status === "maintenance" || room.currentOccupancy >= room.capacity) {
        throw new ApiError_1.ApiError(400, "Room is full or currently under maintenance");
    }
    const booking = await booking_model_1.Booking.create({
        student: studentId,
        room: roomId,
        moveInDate,
        status: "pending",
    });
    return booking;
};
exports.createBookingRequest = createBookingRequest;
const cancelBooking = async (studentId, bookingId, cancellationReason) => {
    if (!mongoose_1.default.isValidObjectId(bookingId)) {
        throw new ApiError_1.ApiError(400, "Invalid Booking ID");
    }
    const booking = await booking_model_1.Booking.findOne({ _id: bookingId, student: studentId });
    if (!booking) {
        throw new ApiError_1.ApiError(404, "Booking request not found");
    }
    if (booking.status !== "pending" && booking.status !== "approved" && booking.status !== "active") {
        throw new ApiError_1.ApiError(400, "Only pending, approved or active bookings can be cancelled");
    }
    const oldStatus = booking.status;
    booking.status = "cancelled";
    booking.cancellationDate = new Date();
    booking.cancellationReason = cancellationReason || "Cancelled by student";
    await booking.save();
    if (oldStatus === "approved" || oldStatus === "active") {
        const roomId = booking.room || booking.get("roomId");
        const room = await room_model_1.Room.findById(roomId);
        if (room) {
            room.currentOccupancy = Math.max(0, room.currentOccupancy - 1);
            if (room.status !== "maintenance") {
                if (room.currentOccupancy === 0) {
                    room.status = "available";
                }
                else if (room.currentOccupancy < room.capacity) {
                    room.status = "occupied";
                }
            }
            await room.save();
        }
    }
    return booking;
};
exports.cancelBooking = cancelBooking;
const getComplaints = async (studentId, filter, page, limit, skip) => {
    const query = { student: studentId, ...filter };
    const total = await complaint_model_1.Complaint.countDocuments(query);
    const data = await complaint_model_1.Complaint.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    return { data, total };
};
exports.getComplaints = getComplaints;
const createComplaint = async (studentId, data) => {
    const complaint = await complaint_model_1.Complaint.create({
        student: studentId,
        ...data,
        status: "pending",
    });
    return complaint;
};
exports.createComplaint = createComplaint;
const getComplaintById = async (studentId, complaintId) => {
    if (!mongoose_1.default.isValidObjectId(complaintId)) {
        throw new ApiError_1.ApiError(400, "Invalid Complaint ID");
    }
    const complaint = await complaint_model_1.Complaint.findOne({ _id: complaintId, student: studentId }).populate("resolvedBy", "name email");
    if (!complaint) {
        throw new ApiError_1.ApiError(404, "Complaint not found");
    }
    return complaint;
};
exports.getComplaintById = getComplaintById;
const getActiveNotices = async (filter, page, limit, skip) => {
    const query = { isActive: true, ...filter };
    const total = await notice_model_1.Notice.countDocuments(query);
    const data = await notice_model_1.Notice.find(query).populate("publishedBy", "name avatar").sort({ publishDate: -1 }).skip(skip).limit(limit);
    return { data, total };
};
exports.getActiveNotices = getActiveNotices;
const getNoticeById = async (noticeId) => {
    if (!mongoose_1.default.isValidObjectId(noticeId)) {
        throw new ApiError_1.ApiError(400, "Invalid Notice ID");
    }
    const notice = await notice_model_1.Notice.findOne({ _id: noticeId, isActive: true }).populate("publishedBy", "name avatar");
    if (!notice) {
        throw new ApiError_1.ApiError(404, "Notice not found");
    }
    return notice;
};
exports.getNoticeById = getNoticeById;
const getPayments = async (studentId, page, limit, skip) => {
    const query = { student: studentId };
    const total = await payment_model_1.Payment.countDocuments(query);
    const data = await payment_model_1.Payment.find(query).populate({ path: "booking", populate: { path: "room" } }).sort({ createdAt: -1 }).skip(skip).limit(limit);
    return { data, total };
};
exports.getPayments = getPayments;
const makePayment = async (studentId, paymentId) => {
    if (!mongoose_1.default.isValidObjectId(paymentId)) {
        throw new ApiError_1.ApiError(400, "Invalid Payment ID");
    }
    const payment = await payment_model_1.Payment.findOne({ _id: paymentId, student: studentId });
    if (!payment) {
        throw new ApiError_1.ApiError(404, "Payment record not found");
    }
    if (payment.status === "paid") {
        throw new ApiError_1.ApiError(400, "Payment has already been paid");
    }
    payment.status = "paid";
    payment.paidAt = new Date();
    payment.transactionId = `TXN-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
    await payment.save();
    return payment;
};
exports.makePayment = makePayment;
const deleteComplaint = async (studentId, complaintId) => {
    if (!mongoose_1.default.isValidObjectId(complaintId)) {
        throw new ApiError_1.ApiError(400, "Invalid Complaint ID");
    }
    const complaint = await complaint_model_1.Complaint.findOneAndDelete({ _id: complaintId, student: studentId });
    if (!complaint) {
        throw new ApiError_1.ApiError(404, "Complaint not found or unauthorized");
    }
    return complaint;
};
exports.deleteComplaint = deleteComplaint;
exports.default = {
    getProfile: exports.getProfile,
    updateProfile: exports.updateProfile,
    getCurrentRoom: exports.getCurrentRoom,
    getBookings: exports.getBookings,
    createBookingRequest: exports.createBookingRequest,
    cancelBooking: exports.cancelBooking,
    getComplaints: exports.getComplaints,
    createComplaint: exports.createComplaint,
    getComplaintById: exports.getComplaintById,
    deleteComplaint: exports.deleteComplaint,
    getActiveNotices: exports.getActiveNotices,
    getNoticeById: exports.getNoticeById,
    getPayments: exports.getPayments,
    makePayment: exports.makePayment,
};
