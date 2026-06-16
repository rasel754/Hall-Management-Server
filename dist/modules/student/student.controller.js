"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComplaint = exports.makePayment = exports.getPayments = exports.getNoticeById = exports.getActiveNotices = exports.getComplaintById = exports.createComplaint = exports.getComplaints = exports.cancelBooking = exports.createBookingRequest = exports.getBookings = exports.getCurrentRoom = exports.updateProfile = exports.getProfile = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const ApiResponse_1 = require("../../utils/ApiResponse");
const student_service_1 = __importDefault(require("./student.service"));
const pagination_1 = require("../../utils/pagination");
exports.getProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await student_service_1.default.getProfile(req.user.id);
    res.status(200).json(new ApiResponse_1.ApiResponse("Profile fetched successfully", result));
});
exports.updateProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await student_service_1.default.updateProfile(req.user.id, req.body);
    res.status(200).json(new ApiResponse_1.ApiResponse("Profile updated successfully", result));
});
exports.getCurrentRoom = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await student_service_1.default.getCurrentRoom(req.user.id);
    res.status(200).json(new ApiResponse_1.ApiResponse("Current room assignment fetched successfully", result));
});
exports.getBookings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await student_service_1.default.getBookings(req.user.id);
    res.status(200).json(new ApiResponse_1.ApiResponse("Booking history fetched successfully", result));
});
exports.createBookingRequest = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { roomId, moveInDate } = req.body;
    const result = await student_service_1.default.createBookingRequest(req.user.id, roomId, moveInDate);
    res.status(201).json(new ApiResponse_1.ApiResponse("Booking request created successfully", result));
});
exports.cancelBooking = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await student_service_1.default.cancelBooking(req.user.id, req.params.id);
    res.status(200).json(new ApiResponse_1.ApiResponse("Booking cancelled successfully", result));
});
exports.getComplaints = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page, limit, skip } = (0, pagination_1.getPaginationParams)(req.query);
    const filter = {};
    if (req.query.status) {
        filter.status = req.query.status;
    }
    const { data, total } = await student_service_1.default.getComplaints(req.user.id, filter, page, limit, skip);
    const meta = (0, pagination_1.getPaginationMeta)(total, page, limit);
    res.status(200).json(new ApiResponse_1.ApiResponse("Complaints fetched successfully", data, meta));
});
exports.createComplaint = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await student_service_1.default.createComplaint(req.user.id, req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse("Complaint submitted successfully", result));
});
exports.getComplaintById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await student_service_1.default.getComplaintById(req.user.id, req.params.id);
    res.status(200).json(new ApiResponse_1.ApiResponse("Complaint detail fetched successfully", result));
});
exports.getActiveNotices = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page, limit, skip } = (0, pagination_1.getPaginationParams)(req.query);
    const filter = {};
    if (req.query.category) {
        filter.category = req.query.category;
    }
    const { data, total } = await student_service_1.default.getActiveNotices(filter, page, limit, skip);
    const meta = (0, pagination_1.getPaginationMeta)(total, page, limit);
    res.status(200).json(new ApiResponse_1.ApiResponse("Notices fetched successfully", data, meta));
});
exports.getNoticeById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await student_service_1.default.getNoticeById(req.params.id);
    res.status(200).json(new ApiResponse_1.ApiResponse("Notice detail fetched successfully", result));
});
exports.getPayments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page, limit, skip } = (0, pagination_1.getPaginationParams)(req.query);
    const { data, total } = await student_service_1.default.getPayments(req.user.id, page, limit, skip);
    const meta = (0, pagination_1.getPaginationMeta)(total, page, limit);
    res.status(200).json(new ApiResponse_1.ApiResponse("Payments fetched successfully", data, meta));
});
exports.makePayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await student_service_1.default.makePayment(req.user.id, req.params.id);
    res.status(200).json(new ApiResponse_1.ApiResponse("Payment marked as paid successfully", result));
});
exports.deleteComplaint = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await student_service_1.default.deleteComplaint(req.user.id, req.params.id);
    res.status(200).json(new ApiResponse_1.ApiResponse("Complaint deleted successfully", result));
});
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
