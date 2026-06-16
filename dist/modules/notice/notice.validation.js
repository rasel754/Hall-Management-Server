"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNoticeSchema = exports.createNoticeSchema = void 0;
const zod_1 = require("zod");
exports.createNoticeSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(5, "Title must be at least 5 characters").max(150, "Title must be less than 150 characters"),
        content: zod_1.z.string().min(20, "Content must be at least 20 characters").max(5000, "Content must be less than 5000 characters"),
        category: zod_1.z.enum(["general", "urgent", "academic", "maintenance"]),
        expiryDate: zod_1.z.string().or(zod_1.z.date()).transform((val) => new Date(val)).optional(),
    }),
});
exports.updateNoticeSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(5, "Title must be at least 5 characters").max(150, "Title must be less than 150 characters").optional(),
        content: zod_1.z.string().min(20, "Content must be at least 20 characters").max(5000, "Content must be less than 5000 characters").optional(),
        category: zod_1.z.enum(["general", "urgent", "academic", "maintenance"]).optional(),
        expiryDate: zod_1.z.string().or(zod_1.z.date()).transform((val) => new Date(val)).optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
