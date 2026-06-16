"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notice_controller_1 = __importDefault(require("./notice.controller"));
const student_controller_1 = __importDefault(require("../student/student.controller"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validateRequest_1 = require("../../middlewares/validateRequest");
const notice_validation_1 = require("./notice.validation");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.verifyToken, auth_middleware_1.checkBlocked);
// GET /api/notices
// Admin gets all notices (including inactive ones), student gets only active notices
router.get("/", (req, res, next) => {
    if (req.user?.role === "admin") {
        return notice_controller_1.default.getNotices(req, res, next);
    }
    else {
        return student_controller_1.default.getActiveNotices(req, res, next);
    }
});
// Admin only routes
router.post("/", (0, auth_middleware_1.requireRole)("admin"), (0, validateRequest_1.validateRequest)(notice_validation_1.createNoticeSchema), notice_controller_1.default.createNotice);
router.put("/:id", (0, auth_middleware_1.requireRole)("admin"), (0, validateRequest_1.validateRequest)(notice_validation_1.updateNoticeSchema), notice_controller_1.default.updateNotice);
router.patch("/:id", (0, auth_middleware_1.requireRole)("admin"), (0, validateRequest_1.validateRequest)(notice_validation_1.updateNoticeSchema), notice_controller_1.default.updateNotice);
router.delete("/:id", (0, auth_middleware_1.requireRole)("admin"), notice_controller_1.default.deleteNotice);
router.put("/:id/toggle", (0, auth_middleware_1.requireRole)("admin"), notice_controller_1.default.toggleNoticeActive);
exports.default = router;
