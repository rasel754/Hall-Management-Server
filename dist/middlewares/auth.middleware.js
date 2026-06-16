"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBlocked = exports.requireRole = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const ApiError_1 = require("../utils/ApiError");
const student_model_1 = require("../modules/student/student.model");
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new ApiError_1.ApiError(401, "Access token is missing or invalid");
        }
        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        }
        catch (err) {
            throw new ApiError_1.ApiError(401, "Access token is invalid or expired");
        }
        const user = await student_model_1.User.findById(decoded.id);
        if (!user) {
            throw new ApiError_1.ApiError(401, "User no longer exists");
        }
        req.user = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            isBlocked: user.isBlocked,
        };
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.verifyToken = verifyToken;
const requireRole = (...roles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                throw new ApiError_1.ApiError(401, "Authentication required");
            }
            if (!roles.includes(req.user.role)) {
                throw new ApiError_1.ApiError(403, "You do not have permission to perform this action");
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.requireRole = requireRole;
const checkBlocked = (req, res, next) => {
    try {
        if (!req.user) {
            throw new ApiError_1.ApiError(401, "Authentication required");
        }
        if (req.user.isBlocked) {
            throw new ApiError_1.ApiError(403, "Account has been blocked");
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.checkBlocked = checkBlocked;
