import { Router } from "express";
import adminController from "./admin.controller";
import { verifyToken, checkBlocked, requireRole } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { blockStudentSchema } from "./admin.validation";

import roomRouter from "../room/room.routes";
import bookingRouter from "../booking/booking.routes";
import complaintRouter from "../complaint/complaint.routes";
import noticeRouter from "../notice/notice.routes";
import paymentRouter from "../payment/payment.routes";
import complaintController from "../complaint/complaint.controller";

const router = Router();

router.use(verifyToken, checkBlocked, requireRole("admin"));

router.get("/dashboard", adminController.getDashboardStats);
router.get("/analytics", adminController.getAnalytics);

router.get("/students", adminController.getStudentsList);
router.get("/students/:id", adminController.getStudentDetail);
router.delete("/students/:id", adminController.deleteStudentAccount);
router.put("/students/:id/block", validateRequest(blockStudentSchema), adminController.blockStudent);
router.put("/students/:id/unblock", adminController.unblockStudent);

// Client compatibility routes
router.patch("/block-user/:id", adminController.blockStudent);
router.patch("/solve-complaint/:id", complaintController.updateComplaintStatus);

router.use("/rooms", roomRouter);
router.use("/bookings", bookingRouter);
router.use("/complaints", complaintRouter);
router.use("/notices", noticeRouter);
router.use("/payments", paymentRouter);

export default router;
