"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const room_controller_1 = __importDefault(require("./room.controller"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const room_validation_1 = require("./room.validation");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get("/", room_controller_1.default.getRooms);
router.get("/:id", room_controller_1.default.getRoomById);
// Admin only mutation routes
router.post("/", auth_middleware_1.verifyToken, auth_middleware_1.checkBlocked, (0, auth_middleware_1.requireRole)("admin"), (0, validateRequest_1.validateRequest)(room_validation_1.createRoomSchema), room_controller_1.default.createRoom);
router.put("/:id", auth_middleware_1.verifyToken, auth_middleware_1.checkBlocked, (0, auth_middleware_1.requireRole)("admin"), (0, validateRequest_1.validateRequest)(room_validation_1.updateRoomSchema), room_controller_1.default.updateRoom);
router.patch("/:id", auth_middleware_1.verifyToken, auth_middleware_1.checkBlocked, (0, auth_middleware_1.requireRole)("admin"), (0, validateRequest_1.validateRequest)(room_validation_1.updateRoomSchema), room_controller_1.default.updateRoom);
router.delete("/:id", auth_middleware_1.verifyToken, auth_middleware_1.checkBlocked, (0, auth_middleware_1.requireRole)("admin"), room_controller_1.default.deleteRoom);
router.put("/:id/status", auth_middleware_1.verifyToken, auth_middleware_1.checkBlocked, (0, auth_middleware_1.requireRole)("admin"), (0, validateRequest_1.validateRequest)(room_validation_1.updateRoomStatusSchema), room_controller_1.default.updateRoomStatus);
exports.default = router;
