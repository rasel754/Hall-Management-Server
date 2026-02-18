import { Router } from "express"
import * as studentController from "../controllers/student.controller"
import { validateRequest } from "../middlewares/validateRequest"
import { verifyStudent } from "../middlewares/authMiddleware"
import { createComplaintSchema } from "../validations/complaint.validation"
import { paymentSchema } from "../validations/payment.validation"

const router = Router()

router.use(verifyStudent)

router.get("/my-room", studentController.getMyRoom)
router.post("/book-room/:roomId", studentController.bookRoom)
router.post("/cancel-seat", studentController.cancelSeat)
router.get("/complaints", studentController.getMyComplaints)
router.post("/complaints", validateRequest(createComplaintSchema), studentController.submitComplaint)
router.get("/notices", studentController.getNotices)
router.get("/payments", studentController.getMyPayments)
router.post("/payments/pay/:id", validateRequest(paymentSchema), studentController.payRent)

export default router
