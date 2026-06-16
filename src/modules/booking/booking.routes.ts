import { Router } from "express";
import bookingController from "./booking.controller";
import studentController from "../student/student.controller";
import { verifyToken, checkBlocked, requireRole } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { rejectBookingSchema } from "./booking.validation";
import { createBookingSchema } from "../student/student.validation";

const router = Router();

router.use(verifyToken, checkBlocked);

// GET /api/bookings
// Admin gets all bookings, student gets own bookings
router.get("/", (req, res, next) => {
  if (req.user?.role === "admin") {
    return bookingController.getBookings(req, res, next);
  } else {
    return studentController.getBookings(req, res, next);
  }
});

// POST /api/bookings
// Student books a room
router.post("/", requireRole("student"), validateRequest(createBookingSchema), studentController.createBookingRequest);

// POST /api/bookings/:id/cancel
// Student cancels own booking request
router.post("/:id/cancel", requireRole("student"), studentController.cancelBooking);

// DELETE /api/bookings/:id
// Student cancels own booking request
router.delete("/:id", requireRole("student"), studentController.cancelBooking);

// PATCH /api/bookings/:id/approve
// Admin approves or rejects booking request (called by client's approveRoomBooking / rejectRoomBooking)
router.patch("/:id/approve", requireRole("admin"), (req, res, next) => {
  const { status } = req.body;
  if (status === "approved") {
    return bookingController.approveBooking(req, res, next);
  } else if (status === "rejected") {
    return bookingController.rejectBooking(req, res, next);
  } else {
    res.status(400).json({ success: false, message: "Invalid status. Must be 'approved' or 'rejected'." });
  }
});

// Compatibility routes for admin
router.put("/:id/approve", requireRole("admin"), bookingController.approveBooking);
router.put("/:id/reject", requireRole("admin"), validateRequest(rejectBookingSchema), bookingController.rejectBooking);

export default router;
