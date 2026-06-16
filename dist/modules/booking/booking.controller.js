"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectBooking = exports.approveBooking = exports.getBookings = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const ApiResponse_1 = require("../../utils/ApiResponse");
const booking_service_1 = __importDefault(require("./booking.service"));
const pagination_1 = require("../../utils/pagination");
exports.getBookings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page, limit, skip } = (0, pagination_1.getPaginationParams)(req.query);
    const filter = {
        status: req.query.status,
        search: req.query.search,
    };
    const { data, total } = await booking_service_1.default.getBookings(filter, page, limit, skip);
    const meta = (0, pagination_1.getPaginationMeta)(total, page, limit);
    res.status(200).json(new ApiResponse_1.ApiResponse("Bookings fetched successfully", data, meta));
});
exports.approveBooking = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await booking_service_1.default.approveBooking(req.params.id, req.user.id);
    res.status(200).json(new ApiResponse_1.ApiResponse("Booking approved successfully", result));
});
exports.rejectBooking = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { reason } = req.body;
    const result = await booking_service_1.default.rejectBooking(req.params.id, reason, req.user.id);
    res.status(200).json(new ApiResponse_1.ApiResponse("Booking rejected successfully", result));
});
exports.default = {
    getBookings: exports.getBookings,
    approveBooking: exports.approveBooking,
    rejectBooking: exports.rejectBooking,
};
