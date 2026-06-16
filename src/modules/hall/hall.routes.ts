import { Router } from "express";
import { verifyToken, checkBlocked, requireRole } from "../../middlewares/auth.middleware";
import hallController from "./hall.controller";

const router = Router();

// Retrieve halls is authenticated, mutate is admin only
router.use(verifyToken, checkBlocked);

router.get("/", hallController.getAllHalls);
router.post("/", requireRole("admin"), hallController.createHall);
router.patch("/:id", requireRole("admin"), hallController.updateHall);
router.put("/:id", requireRole("admin"), hallController.updateHall);
router.delete("/:id", requireRole("admin"), hallController.deleteHall);

export default router;
