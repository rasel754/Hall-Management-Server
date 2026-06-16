"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = __importDefault(require("./payment.controller"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const payment_validation_1 = require("./payment.validation");
const router = (0, express_1.Router)();
router.get("/", payment_controller_1.default.getPayments);
router.put("/:id/status", (0, validateRequest_1.validateRequest)(payment_validation_1.updatePaymentStatusSchema), payment_controller_1.default.updatePaymentStatus);
exports.default = router;
