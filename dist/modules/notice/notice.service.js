"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleNoticeActive = exports.deleteNotice = exports.updateNotice = exports.createNotice = exports.getNotices = void 0;
const notice_model_1 = require("./notice.model");
const ApiError_1 = require("../../utils/ApiError");
const mongoose_1 = __importDefault(require("mongoose"));
const getNotices = async (filter, page, limit, skip) => {
    const query = {};
    if (filter.category) {
        query.category = filter.category;
    }
    if (filter.isActive !== undefined && filter.isActive !== "") {
        query.isActive = filter.isActive === "true" || filter.isActive === true;
    }
    const total = await notice_model_1.Notice.countDocuments(query);
    const data = await notice_model_1.Notice.find(query)
        .populate("publishedBy", "name email avatar")
        .sort({ publishDate: -1 })
        .skip(skip)
        .limit(limit);
    return { data, total };
};
exports.getNotices = getNotices;
const createNotice = async (data, adminId) => {
    const notice = await notice_model_1.Notice.create({
        ...data,
        publishedBy: new mongoose_1.default.Types.ObjectId(adminId),
        publishDate: new Date(),
    });
    return notice;
};
exports.createNotice = createNotice;
const updateNotice = async (noticeId, data) => {
    if (!mongoose_1.default.isValidObjectId(noticeId)) {
        throw new ApiError_1.ApiError(400, "Invalid Notice ID");
    }
    const notice = await notice_model_1.Notice.findByIdAndUpdate(noticeId, { $set: data }, { new: true });
    if (!notice) {
        throw new ApiError_1.ApiError(404, "Notice not found");
    }
    return notice;
};
exports.updateNotice = updateNotice;
const deleteNotice = async (noticeId) => {
    if (!mongoose_1.default.isValidObjectId(noticeId)) {
        throw new ApiError_1.ApiError(400, "Invalid Notice ID");
    }
    const notice = await notice_model_1.Notice.findByIdAndDelete(noticeId);
    if (!notice) {
        throw new ApiError_1.ApiError(404, "Notice not found");
    }
    return notice;
};
exports.deleteNotice = deleteNotice;
const toggleNoticeActive = async (noticeId) => {
    if (!mongoose_1.default.isValidObjectId(noticeId)) {
        throw new ApiError_1.ApiError(400, "Invalid Notice ID");
    }
    const notice = await notice_model_1.Notice.findById(noticeId);
    if (!notice) {
        throw new ApiError_1.ApiError(404, "Notice not found");
    }
    notice.isActive = !notice.isActive;
    await notice.save();
    return notice;
};
exports.toggleNoticeActive = toggleNoticeActive;
exports.default = {
    getNotices: exports.getNotices,
    createNotice: exports.createNotice,
    updateNotice: exports.updateNotice,
    deleteNotice: exports.deleteNotice,
    toggleNoticeActive: exports.toggleNoticeActive,
};
