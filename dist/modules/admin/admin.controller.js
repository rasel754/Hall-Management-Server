"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalytics = exports.unblockStudent = exports.blockStudent = exports.deleteStudentAccount = exports.getStudentDetail = exports.getStudentsList = exports.getDashboardStats = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const ApiResponse_1 = require("../../utils/ApiResponse");
const admin_service_1 = __importDefault(require("./admin.service"));
const pagination_1 = require("../../utils/pagination");
exports.getDashboardStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await admin_service_1.default.getDashboardStats();
    res.status(200).json(new ApiResponse_1.ApiResponse("Dashboard stats fetched successfully", result));
});
exports.getStudentsList = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page, limit, skip } = (0, pagination_1.getPaginationParams)(req.query);
    const filter = {
        search: req.query.search,
        department: req.query.department,
    };
    const sortField = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder || "desc";
    const { data, total } = await admin_service_1.default.getStudentsList(filter, page, limit, skip, sortField, sortOrder);
    const meta = (0, pagination_1.getPaginationMeta)(total, page, limit);
    res.status(200).json(new ApiResponse_1.ApiResponse("Students list fetched successfully", data, meta));
});
exports.getStudentDetail = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await admin_service_1.default.getStudentDetail(req.params.id);
    res.status(200).json(new ApiResponse_1.ApiResponse("Student details fetched successfully", result));
});
exports.deleteStudentAccount = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await admin_service_1.default.deleteStudentAccount(req.params.id);
    res.status(200).json(new ApiResponse_1.ApiResponse("Student account deleted successfully", result));
});
exports.blockStudent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { reason } = req.body;
    const result = await admin_service_1.default.blockStudent(req.params.id, reason);
    res.status(200).json(new ApiResponse_1.ApiResponse("Student blocked successfully", result));
});
exports.unblockStudent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await admin_service_1.default.unblockStudent(req.params.id);
    res.status(200).json(new ApiResponse_1.ApiResponse("Student unblocked successfully", result));
});
exports.getAnalytics = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await admin_service_1.default.getAnalytics();
    res.status(200).json(new ApiResponse_1.ApiResponse("Analytics data fetched successfully", result));
});
exports.default = {
    getDashboardStats: exports.getDashboardStats,
    getStudentsList: exports.getStudentsList,
    getStudentDetail: exports.getStudentDetail,
    deleteStudentAccount: exports.deleteStudentAccount,
    blockStudent: exports.blockStudent,
    unblockStudent: exports.unblockStudent,
    getAnalytics: exports.getAnalytics,
};
