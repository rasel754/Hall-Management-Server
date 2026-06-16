"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockStudentSchema = void 0;
const zod_1 = require("zod");
exports.blockStudentSchema = zod_1.z.object({
    body: zod_1.z.object({
        reason: zod_1.z.string().min(1, "Block reason is required"),
    }),
});
