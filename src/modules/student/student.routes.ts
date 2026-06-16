import { Router } from "express";
import studentController from "./student.controller";
import { verifyToken, checkBlocked, requireRole } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateProfileSchema, createBookingSchema, createComplaintSchema } from "./student.validation";

const router = Router();

router.use(verifyToken, checkBlocked, requireRole("student"));

router.get("/profile", studentController.getProfile);
router.put("/profile", validateRequest(updateProfileSchema), studentController.updateProfile);

router.get("/room", studentController.getCurrentRoom);

router.get("/bookings", studentController.getBookings);
router.post("/bookings", validateRequest(createBookingSchema), studentController.createBookingRequest);
router.delete("/bookings/:id", studentController.cancelBooking);

router.get("/complaints", studentController.getComplaints);
router.post("/complaints", validateRequest(createComplaintSchema), studentController.createComplaint);
router.get("/complaints/:id", studentController.getComplaintById);

router.get("/notices", studentController.getActiveNotices);
router.get("/notices/:id", studentController.getNoticeById);

router.get("/payments", studentController.getPayments);
router.post("/payments/pay/:id", studentController.makePayment);
router.post("/payments/:id/pay", studentController.makePayment);

export default router;
