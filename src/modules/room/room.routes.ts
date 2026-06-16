import { Router } from "express";
import roomController from "./room.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createRoomSchema, updateRoomSchema, updateRoomStatusSchema } from "./room.validation";
import { verifyToken, checkBlocked, requireRole } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", roomController.getRooms);
router.get("/:id", roomController.getRoomById);

// Admin only mutation routes
router.post("/", verifyToken, checkBlocked, requireRole("admin"), validateRequest(createRoomSchema), roomController.createRoom);
router.put("/:id", verifyToken, checkBlocked, requireRole("admin"), validateRequest(updateRoomSchema), roomController.updateRoom);
router.patch("/:id", verifyToken, checkBlocked, requireRole("admin"), validateRequest(updateRoomSchema), roomController.updateRoom);
router.delete("/:id", verifyToken, checkBlocked, requireRole("admin"), roomController.deleteRoom);
router.put("/:id/status", verifyToken, checkBlocked, requireRole("admin"), validateRequest(updateRoomStatusSchema), roomController.updateRoomStatus);

export default router;
