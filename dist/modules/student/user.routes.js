"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const admin_controller_1 = __importDefault(require("../admin/admin.controller"));
const student_controller_1 = __importDefault(require("./student.controller"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const student_validation_1 = require("./student.validation");
const student_model_1 = require("./student.model");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.verifyToken, auth_middleware_1.checkBlocked);
// PATCH /api/users/profile
// Student or anyone updates their own profile
router.patch("/profile", (0, validateRequest_1.validateRequest)(student_validation_1.updateProfileSchema), student_controller_1.default.updateProfile);
router.put("/profile", (0, validateRequest_1.validateRequest)(student_validation_1.updateProfileSchema), student_controller_1.default.updateProfile);
// GET /api/users
// Admin gets all users/students list. Without pagination, returns all, with pagination runs getStudentsList
router.get("/", (0, auth_middleware_1.requireRole)("admin"), async (req, res, next) => {
    try {
        if (req.query.page || req.query.limit) {
            return admin_controller_1.default.getStudentsList(req, res, next);
        }
        const users = await student_model_1.User.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: users });
    }
    catch (error) {
        next(error);
    }
});
// PATCH /api/users/:id/activate
// Admin activates/unblocks user
router.patch("/:id/activate", (0, auth_middleware_1.requireRole)("admin"), admin_controller_1.default.unblockStudent);
// PATCH /api/users/:id/deactivate
// Admin deactivates/blocks user
router.patch("/:id/deactivate", (0, auth_middleware_1.requireRole)("admin"), admin_controller_1.default.blockStudent);
exports.default = router;
