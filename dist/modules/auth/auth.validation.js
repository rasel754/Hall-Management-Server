"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, "Name must be 2 to 50 characters").max(50, "Name must be 2 to 50 characters"),
        email: zod_1.z.string().email("Invalid email format").toLowerCase(),
        password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
        studentId: zod_1.z.string().min(1, "Student ID is required").trim(),
        department: zod_1.z.string().min(1, "Department is required").trim(),
        year: zod_1.z.coerce.number().min(1, "Year must be between 1 and 4").max(4, "Year must be between 1 and 4"),
        phone: zod_1.z.string().min(1, "Phone number is required").trim(),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email format").toLowerCase(),
        password: zod_1.z.string().min(1, "Password is required"),
    }),
});
exports.forgotPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email format").toLowerCase(),
    }),
});
exports.resetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
    }),
});
exports.changePasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string().min(1, "Current password is required"),
        newPassword: zod_1.z.string().min(8, "New password must be at least 8 characters"),
    }),
});
