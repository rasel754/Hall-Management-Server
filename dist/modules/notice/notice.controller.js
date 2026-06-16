"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleNoticeActive = exports.deleteNotice = exports.updateNotice = exports.createNotice = exports.getNotices = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const ApiResponse_1 = require("../../utils/ApiResponse");
const notice_service_1 = __importDefault(require("./notice.service"));
const pagination_1 = require("../../utils/pagination");
exports.getNotices = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page, limit, skip } = (0, pagination_1.getPaginationParams)(req.query);
    const filter = {
        category: req.query.category,
        isActive: req.query.isActive,
    };
    const { data, total } = await notice_service_1.default.getNotices(filter, page, limit, skip);
    const meta = (0, pagination_1.getPaginationMeta)(total, page, limit);
    res.status(200).json(new ApiResponse_1.ApiResponse("Notices fetched successfully", data, meta));
});
exports.createNotice = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await notice_service_1.default.createNotice(req.body, req.user.id);
    res.status(201).json(new ApiResponse_1.ApiResponse("Notice created successfully", result));
});
exports.updateNotice = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await notice_service_1.default.updateNotice(req.params.id, req.body);
    res.status(200).json(new ApiResponse_1.ApiResponse("Notice updated successfully", result));
});
exports.deleteNotice = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await notice_service_1.default.deleteNotice(req.params.id);
    res.status(200).json(new ApiResponse_1.ApiResponse("Notice deleted successfully", result));
});
exports.toggleNoticeActive = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await notice_service_1.default.toggleNoticeActive(req.params.id);
    res.status(200).json(new ApiResponse_1.ApiResponse("Notice active state toggled successfully", result));
});
exports.default = {
    getNotices: exports.getNotices,
    createNotice: exports.createNotice,
    updateNotice: exports.updateNotice,
    deleteNotice: exports.deleteNotice,
    toggleNoticeActive: exports.toggleNoticeActive,
};
