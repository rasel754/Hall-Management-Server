import { Router } from "express";
import paymentController from "./payment.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { updatePaymentStatusSchema } from "./payment.validation";

const router = Router();

router.get("/", paymentController.getPayments);
router.put("/:id/status", validateRequest(updatePaymentStatusSchema), paymentController.updatePaymentStatus);

export default router;
