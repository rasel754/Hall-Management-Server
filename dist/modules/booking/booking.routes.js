"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booking_controller_1 = __importDefault(require("./booking.controller"));
const student_controller_1 = __importDefault(require("../student/student.controller"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validateRequest_1 = require("../../middlewares/validateRequest");
const booking_validation_1 = require("./booking.validation");
const student_validation_1 = require("../student/student.validation");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.verifyToken, auth_middleware_1.checkBlocked);
// GET /api/bookings
// Admin gets all bookings, student gets own bookings
router.get("/", (req, res, next) => {
    if (req.user?.role === "admin") {
        return booking_controller_1.default.getBookings(req, res, next);
    }
    else {
        return student_controller_1.default.getBookings(req, res, next);
    }
});
// POST /api/bookings
// Student books a room
router.post("/", (0, auth_middleware_1.requireRole)("student"), (0, validateRequest_1.validateRequest)(student_validation_1.createBookingSchema), student_controller_1.default.createBookingRequest);
// POST /api/bookings/:id/cancel
// Student cancels own booking request
router.post("/:id/cancel", (0, auth_middleware_1.requireRole)("student"), student_controller_1.default.cancelBooking);
// DELETE /api/bookings/:id
// Student cancels own booking request
router.delete("/:id", (0, auth_middleware_1.requireRole)("student"), student_controller_1.default.cancelBooking);
// PATCH /api/bookings/:id/approve
// Admin approves or rejects booking request (called by client's approveRoomBooking / rejectRoomBooking)
router.patch("/:id/approve", (0, auth_middleware_1.requireRole)("admin"), (req, res, next) => {
    const { status } = req.body;
    if (status === "approved") {
        return booking_controller_1.default.approveBooking(req, res, next);
    }
    else if (status === "rejected") {
        return booking_controller_1.default.rejectBooking(req, res, next);
    }
    else {
        res.status(400).json({ success: false, message: "Invalid status. Must be 'approved' or 'rejected'." });
    }
});
// Compatibility routes for admin
router.put("/:id/approve", (0, auth_middleware_1.requireRole)("admin"), booking_controller_1.default.approveBooking);
router.put("/:id/reject", (0, auth_middleware_1.requireRole)("admin"), (0, validateRequest_1.validateRequest)(booking_validation_1.rejectBookingSchema), booking_controller_1.default.rejectBooking);
exports.default = router;
