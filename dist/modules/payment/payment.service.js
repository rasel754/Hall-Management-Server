"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentStatus = exports.getPayments = void 0;
const payment_model_1 = require("./payment.model");
const ApiError_1 = require("../../utils/ApiError");
const mongoose_1 = __importDefault(require("mongoose"));
const getPayments = async (filter, page, limit, skip) => {
    const query = {};
    if (filter.status) {
        query.status = filter.status;
    }
    if (filter.month) {
        query.month = filter.month;
    }
    const total = await payment_model_1.Payment.countDocuments(query);
    const data = await payment_model_1.Payment.find(query)
        .populate("student", "name email studentId avatar department year phone")
        .populate({
        path: "booking",
        populate: { path: "room" },
    })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    return { data, total };
};
exports.getPayments = getPayments;
const updatePaymentStatus = async (paymentId, status) => {
    if (!mongoose_1.default.isValidObjectId(paymentId)) {
        throw new ApiError_1.ApiError(400, "Invalid Payment ID");
    }
    const payment = await payment_model_1.Payment.findById(paymentId);
    if (!payment) {
        throw new ApiError_1.ApiError(404, "Payment record not found");
    }
    payment.status = status;
    if (status === "paid") {
        payment.paidAt = new Date();
        if (!payment.transactionId) {
            payment.transactionId = `TXN-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
        }
    }
    else {
        payment.paidAt = undefined;
        payment.transactionId = undefined;
    }
    await payment.save();
    return payment;
};
exports.updatePaymentStatus = updatePaymentStatus;
exports.default = {
    getPayments: exports.getPayments,
    updatePaymentStatus: exports.updatePaymentStatus,
};
