"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const hall_controller_1 = __importDefault(require("./hall.controller"));
const router = (0, express_1.Router)();
// Retrieve halls is authenticated, mutate is admin only
router.use(auth_middleware_1.verifyToken, auth_middleware_1.checkBlocked);
router.get("/", hall_controller_1.default.getAllHalls);
router.post("/", (0, auth_middleware_1.requireRole)("admin"), hall_controller_1.default.createHall);
router.patch("/:id", (0, auth_middleware_1.requireRole)("admin"), hall_controller_1.default.updateHall);
router.put("/:id", (0, auth_middleware_1.requireRole)("admin"), hall_controller_1.default.updateHall);
router.delete("/:id", (0, auth_middleware_1.requireRole)("admin"), hall_controller_1.default.deleteHall);
exports.default = router;
