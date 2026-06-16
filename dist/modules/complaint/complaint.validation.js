"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateComplaintStatusSchema = void 0;
const zod_1 = require("zod");
exports.updateComplaintStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(["pending", "in_progress", "resolved"]),
        adminNote: zod_1.z.string().optional(),
    }),
});
