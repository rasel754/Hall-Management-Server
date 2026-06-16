"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoomStatusSchema = exports.updateRoomSchema = exports.createRoomSchema = void 0;
const zod_1 = require("zod");
exports.createRoomSchema = zod_1.z.object({
    body: zod_1.z.object({
        roomNumber: zod_1.z.string().min(1, "Room number is required"),
        floor: zod_1.z.coerce.number().min(0, "Floor must be 0 or higher"),
        type: zod_1.z.enum(["single", "double", "triple"]),
        capacity: zod_1.z.coerce.number().min(1, "Capacity must be at least 1"),
        pricePerMonth: zod_1.z.coerce.number().min(0, "Price per month must be positive"),
        facilities: zod_1.z.array(zod_1.z.string()).default([]),
        images: zod_1.z.array(zod_1.z.string()).default([]),
    }),
});
exports.updateRoomSchema = zod_1.z.object({
    body: zod_1.z.object({
        roomNumber: zod_1.z.string().min(1, "Room number is required").optional(),
        floor: zod_1.z.coerce.number().min(0, "Floor must be 0 or higher").optional(),
        type: zod_1.z.enum(["single", "double", "triple"]).optional(),
        capacity: zod_1.z.coerce.number().min(1, "Capacity must be at least 1").optional(),
        pricePerMonth: zod_1.z.coerce.number().min(0, "Price per month must be positive").optional(),
        facilities: zod_1.z.array(zod_1.z.string()).optional(),
        images: zod_1.z.array(zod_1.z.string()).optional(),
        status: zod_1.z.enum(["available", "occupied", "full", "maintenance"]).optional(),
    }),
});
exports.updateRoomStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(["available", "occupied", "full", "maintenance"]),
    }),
});
