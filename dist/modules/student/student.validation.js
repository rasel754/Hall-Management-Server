"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComplaintSchema = exports.createBookingSchema = exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, "Name must be at least 2 characters").max(50).optional(),
        phone: zod_1.z.string().optional(),
        department: zod_1.z.string().optional(),
        year: zod_1.z.coerce.number().min(1).max(4).optional(),
        avatar: zod_1.z.string().optional(),
        emergencyContact: zod_1.z
            .object({
            name: zod_1.z.string().default(""),
            phone: zod_1.z.string().default(""),
            relation: zod_1.z.string().default(""),
        })
            .optional(),
    }),
});
exports.createBookingSchema = zod_1.z.object({
    body: zod_1.z.object({
        roomId: zod_1.z.string().min(1, "roomId is required"),
        moveInDate: zod_1.z.string().or(zod_1.z.date()).optional(),
        startDate: zod_1.z.string().or(zod_1.z.date()).optional(),
    }).refine((data) => data.moveInDate || data.startDate, {
        message: "Either moveInDate or startDate is required",
        path: ["moveInDate"],
    }),
});
exports.createComplaintSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
        category: zod_1.z.enum(["maintenance", "noise", "cleanliness", "security", "other"]),
        description: zod_1.z.string().min(20, "Description must be at least 20 characters").max(1000, "Description must be less than 1000 characters"),
        image: zod_1.z.string().optional(),
    }),
});
