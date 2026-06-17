"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateComplaintStatus = exports.getComplaints = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const complaint_service_1 = __importDefault(require("./complaint.service"));
const pagination_1 = require("../../utils/pagination");
exports.getComplaints = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page, limit, skip } = (0, pagination_1.getPaginationParams)(req.query);
    const filter = {
        status: req.query.status,
        category: req.query.category,
    };
    const { data, total } = await complaint_service_1.default.getComplaints(filter, page, limit, skip);
    const meta = (0, pagination_1.getPaginationMeta)(total, page, limit);
    res.status(200).json(new ApiResponse_1.ApiResponse("Complaints fetched successfully", data, meta));
});
exports.updateComplaintStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { status, adminNote } = req.body || {};
    if (!status) {
        throw new ApiError_1.ApiError(400, "Status is required");
    }
    const result = await complaint_service_1.default.updateComplaintStatus(req.params.id, status, adminNote, req.user.id);
    res.status(200).json(new ApiResponse_1.ApiResponse("Complaint status updated successfully", result));
});
exports.default = {
    getComplaints: exports.getComplaints,
    updateComplaintStatus: exports.updateComplaintStatus,
};
