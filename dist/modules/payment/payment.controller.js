"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentStatus = exports.getPayments = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const ApiResponse_1 = require("../../utils/ApiResponse");
const payment_service_1 = __importDefault(require("./payment.service"));
const pagination_1 = require("../../utils/pagination");
exports.getPayments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page, limit, skip } = (0, pagination_1.getPaginationParams)(req.query);
    const filter = {
        status: req.query.status,
        month: req.query.month,
    };
    const { data, total } = await payment_service_1.default.getPayments(filter, page, limit, skip);
    const meta = (0, pagination_1.getPaginationMeta)(total, page, limit);
    res.status(200).json(new ApiResponse_1.ApiResponse("Payments fetched successfully", data, meta));
});
exports.updatePaymentStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { status } = req.body;
    const result = await payment_service_1.default.updatePaymentStatus(req.params.id, status);
    res.status(200).json(new ApiResponse_1.ApiResponse("Payment status updated successfully", result));
});
exports.default = {
    getPayments: exports.getPayments,
    updatePaymentStatus: exports.updatePaymentStatus,
};
