"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectBooking = exports.approveBooking = exports.getBookings = void 0;
const booking_model_1 = require("./booking.model");
const room_model_1 = require("../room/room.model");
const student_model_1 = require("../student/student.model");
const payment_model_1 = require("../payment/payment.model");
const ApiError_1 = require("../../utils/ApiError");
const mongoose_1 = __importDefault(require("mongoose"));
const getBookings = async (filter, page, limit, skip) => {
    const query = {};
    if (filter.status) {
        query.status = filter.status;
    }
    if (filter.search) {
        const students = await student_model_1.User.find({
            name: { $regex: filter.search, $options: "i" },
        }).select("_id");
        const studentIds = students.map((s) => s._id);
        query.student = { $in: studentIds };
    }
    const total = await booking_model_1.Booking.countDocuments(query);
    const data = await booking_model_1.Booking.find(query)
        .populate("student", "name email studentId avatar department year phone")
        .populate("room")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    return { data, total };
};
exports.getBookings = getBookings;
const approveBooking = async (bookingId, adminId) => {
    if (!mongoose_1.default.isValidObjectId(bookingId)) {
        throw new ApiError_1.ApiError(400, "Invalid Booking ID");
    }
    const booking = await booking_model_1.Booking.findById(bookingId);
    if (!booking) {
        throw new ApiError_1.ApiError(404, "Booking request not found");
    }
    if (booking.status !== "pending") {
        throw new ApiError_1.ApiError(400, `Booking is already ${booking.status}`);
    }
    const room = await room_model_1.Room.findById(booking.room);
    if (!room) {
        throw new ApiError_1.ApiError(404, "Room not found");
    }
    if (room.currentOccupancy >= room.capacity) {
        room.status = "full";
        await room.save();
        throw new ApiError_1.ApiError(400, "Room is already full");
    }
    booking.status = "approved";
    booking.approvalDate = new Date();
    booking.approvedBy = new mongoose_1.default.Types.ObjectId(adminId);
    booking.moveInDate = new Date();
    await booking.save();
    room.currentOccupancy += 1;
    if (room.currentOccupancy >= room.capacity) {
        room.status = "full";
    }
    else {
        room.status = "occupied";
    }
    await room.save();
    const monthString = new Date().toISOString().substring(0, 7);
    await payment_model_1.Payment.create({
        student: booking.student,
        booking: booking._id,
        amount: room.pricePerMonth,
        month: monthString,
        status: "pending",
    });
    return booking;
};
exports.approveBooking = approveBooking;
const rejectBooking = async (bookingId, reason, adminId) => {
    if (!mongoose_1.default.isValidObjectId(bookingId)) {
        throw new ApiError_1.ApiError(400, "Invalid Booking ID");
    }
    const booking = await booking_model_1.Booking.findById(bookingId);
    if (!booking) {
        throw new ApiError_1.ApiError(404, "Booking request not found");
    }
    if (booking.status !== "pending") {
        throw new ApiError_1.ApiError(400, `Booking is already ${booking.status}`);
    }
    booking.status = "rejected";
    booking.approvedBy = new mongoose_1.default.Types.ObjectId(adminId);
    booking.approvalDate = new Date();
    booking.cancellationReason = reason;
    booking.cancellationDate = new Date();
    await booking.save();
    return booking;
};
exports.rejectBooking = rejectBooking;
exports.default = {
    getBookings: exports.getBookings,
    approveBooking: exports.approveBooking,
    rejectBooking: exports.rejectBooking,
};
