"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.getMe = exports.resetPassword = exports.forgotPassword = exports.logout = exports.login = exports.register = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const ApiResponse_1 = require("../../utils/ApiResponse");
const auth_service_1 = __importDefault(require("./auth.service"));
const student_model_1 = require("../student/student.model");
const ApiError_1 = require("../../utils/ApiError");
exports.register = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await auth_service_1.default.registerStudent(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse("Student registered successfully", result));
});
exports.login = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await auth_service_1.default.loginUser(req.body);
    res.status(200).json(new ApiResponse_1.ApiResponse("Login successful", result));
});
exports.logout = (0, catchAsync_1.catchAsync)(async (req, res) => {
    res.status(200).json(new ApiResponse_1.ApiResponse("Logout successful", null));
});
exports.forgotPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await auth_service_1.default.forgotPassword(req.body.email);
    res.status(200).json(new ApiResponse_1.ApiResponse("Password reset email sent successfully", null));
});
exports.resetPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { token } = req.params;
    await auth_service_1.default.resetPassword(token, req.body.password);
    res.status(200).json(new ApiResponse_1.ApiResponse("Password reset successfully", null));
});
exports.getMe = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user) {
        throw new ApiError_1.ApiError(401, "User not authenticated");
    }
    const user = await student_model_1.User.findById(req.user.id);
    if (!user) {
        throw new ApiError_1.ApiError(404, "User not found");
    }
    res.status(200).json(new ApiResponse_1.ApiResponse("Profile fetched successfully", user));
});
exports.changePassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user) {
        throw new ApiError_1.ApiError(401, "User not authenticated");
    }
    await auth_service_1.default.changePassword(req.user.id, req.body);
    res.status(200).json(new ApiResponse_1.ApiResponse("Password changed successfully", null));
});
exports.default = {
    register: exports.register,
    login: exports.login,
    logout: exports.logout,
    forgotPassword: exports.forgotPassword,
    resetPassword: exports.resetPassword,
    getMe: exports.getMe,
    changePassword: exports.changePassword,
};
