"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentStatusSchema = void 0;
const zod_1 = require("zod");
exports.updatePaymentStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(["pending", "paid", "overdue"]),
    }),
});
