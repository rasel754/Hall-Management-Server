"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateComplaintStatus = exports.getComplaints = void 0;
const complaint_model_1 = require("./complaint.model");
const ApiError_1 = require("../../utils/ApiError");
const mongoose_1 = __importDefault(require("mongoose"));
const getComplaints = async (filter, page, limit, skip) => {
    const query = {};
    if (filter.status) {
        query.status = filter.status;
    }
    if (filter.category) {
        query.category = filter.category;
    }
    const total = await complaint_model_1.Complaint.countDocuments(query);
    const data = await complaint_model_1.Complaint.find(query)
        .populate("student", "name email studentId avatar department year phone")
        .populate("resolvedBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    return { data, total };
};
exports.getComplaints = getComplaints;
const updateComplaintStatus = async (complaintId, status, adminNote, adminId) => {
    if (!mongoose_1.default.isValidObjectId(complaintId)) {
        throw new ApiError_1.ApiError(400, "Invalid Complaint ID");
    }
    const updateDoc = { status };
    if (adminNote !== undefined) {
        updateDoc.adminNote = adminNote;
    }
    if (status === "resolved") {
        updateDoc.resolvedBy = new mongoose_1.default.Types.ObjectId(adminId);
        updateDoc.resolvedAt = new Date();
    }
    else {
        updateDoc.resolvedBy = null;
        updateDoc.resolvedAt = null;
    }
    const complaint = await complaint_model_1.Complaint.findByIdAndUpdate(complaintId, { $set: updateDoc }, { new: true, runValidators: true });
    if (!complaint) {
        throw new ApiError_1.ApiError(404, "Complaint not found");
    }
    return complaint;
};
exports.updateComplaintStatus = updateComplaintStatus;
exports.default = {
    getComplaints: exports.getComplaints,
    updateComplaintStatus: exports.updateComplaintStatus,
};
