import { Router } from "express"
import * as adminController from "../controllers/admin.controller"
import { validateRequest } from "../middlewares/validateRequest"
import { verifyAdmin } from "../middlewares/authMiddleware"
import { createNoticeSchema } from "../validations/notice.validation"
import { approveBookingSchema } from "../validations/room.validation"

const router = Router()

router.use(verifyAdmin)

router.get("/dashboard", adminController.getDashboard)
router.get("/rooms", adminController.getAllRooms)
router.patch("/rooms/approve/:roomId", validateRequest(approveBookingSchema), adminController.approveBooking)
router.get("/students", adminController.getAllStudents)
router.post("/notices", validateRequest(createNoticeSchema), adminController.publishNotice)
router.patch("/block-user/:id", adminController.blockUser)
router.patch("/solve-complaint/:id", adminController.solveComplaint)
router.get("/available-rooms", adminController.getAvailableRooms)

export default router
