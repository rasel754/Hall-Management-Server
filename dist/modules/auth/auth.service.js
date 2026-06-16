"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.resetPassword = exports.forgotPassword = exports.loginUser = exports.registerStudent = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const student_model_1 = require("../student/student.model");
const ApiError_1 = require("../../utils/ApiError");
const env_1 = require("../../config/env");
const sendEmail_1 = require("../../utils/sendEmail");
const registerStudent = async (body) => {
    const existingEmail = await student_model_1.User.findOne({ email: body.email });
    if (existingEmail) {
        throw new ApiError_1.ApiError(409, "Email is already registered");
    }
    if (body.studentId) {
        const existingStudentId = await student_model_1.User.findOne({ studentId: body.studentId });
        if (existingStudentId) {
            throw new ApiError_1.ApiError(409, "Student ID is already registered");
        }
    }
    const user = await student_model_1.User.create({
        ...body,
        role: "student",
    });
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
};
exports.registerStudent = registerStudent;
const loginUser = async (body) => {
    const user = await student_model_1.User.findOne({ email: body.email }).select("+password");
    if (!user) {
        throw new ApiError_1.ApiError(401, "Invalid email or password");
    }
    const isMatch = await user.comparePassword(body.password);
    if (!isMatch) {
        throw new ApiError_1.ApiError(401, "Invalid email or password");
    }
    if (user.isBlocked) {
        throw new ApiError_1.ApiError(403, "Account has been blocked");
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id.toString(), email: user.email, role: user.role }, env_1.env.JWT_SECRET, { expiresIn: env_1.env.JWT_EXPIRES_IN });
    const userObject = user.toObject();
    delete userObject.password;
    return { token, user: userObject };
};
exports.loginUser = loginUser;
const forgotPassword = async (email) => {
    const user = await student_model_1.User.findOne({ email });
    if (!user) {
        throw new ApiError_1.ApiError(404, "User not found with this email");
    }
    const resetToken = jsonwebtoken_1.default.sign({ id: user._id.toString(), type: "password-reset" }, env_1.env.JWT_SECRET, { expiresIn: "15m" });
    const resetUrl = `${env_1.env.FRONTEND_ORIGIN}/reset-password/${resetToken}`;
    const html = `
    <h1>Password Reset Request</h1>
    <p>You requested to reset your password. Please click the link below to set a new password:</p>
    <a href="${resetUrl}" target="_blank">${resetUrl}</a>
    <p>This link will expire in 15 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
  `;
    await (0, sendEmail_1.sendEmail)(user.email, "Reset Your Password - Hall Management System", html);
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (token, newPassword) => {
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
    }
    catch (error) {
        throw new ApiError_1.ApiError(400, "Reset token is invalid or expired");
    }
    if (decoded.type !== "password-reset") {
        throw new ApiError_1.ApiError(400, "Invalid token type");
    }
    const user = await student_model_1.User.findById(decoded.id);
    if (!user) {
        throw new ApiError_1.ApiError(404, "User not found");
    }
    user.password = newPassword;
    await user.save();
};
exports.resetPassword = resetPassword;
const changePassword = async (userId, body) => {
    const user = await student_model_1.User.findById(userId).select("+password");
    if (!user) {
        throw new ApiError_1.ApiError(404, "User not found");
    }
    const isMatch = await user.comparePassword(body.currentPassword);
    if (!isMatch) {
        throw new ApiError_1.ApiError(400, "Current password is incorrect");
    }
    user.password = body.newPassword;
    await user.save();
};
exports.changePassword = changePassword;
exports.default = {
    registerStudent: exports.registerStudent,
    loginUser: exports.loginUser,
    forgotPassword: exports.forgotPassword,
    resetPassword: exports.resetPassword,
    changePassword: exports.changePassword,
};
