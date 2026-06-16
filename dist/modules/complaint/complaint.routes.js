"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const complaint_controller_1 = __importDefault(require("./complaint.controller"));
const student_controller_1 = __importDefault(require("../student/student.controller"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validateRequest_1 = require("../../middlewares/validateRequest");
const complaint_validation_1 = require("./complaint.validation");
const student_validation_1 = require("../student/student.validation");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.verifyToken, auth_middleware_1.checkBlocked);
// GET /api/complaints
// Admin gets all complaints, student gets own complaints
router.get("/", (req, res, next) => {
    if (req.user?.role === "admin") {
        return complaint_controller_1.default.getComplaints(req, res, next);
    }
    else {
        return student_controller_1.default.getComplaints(req, res, next);
    }
});
// POST /api/complaints
// Student creates a complaint
router.post("/", (0, auth_middleware_1.requireRole)("student"), (0, validateRequest_1.validateRequest)(student_validation_1.createComplaintSchema), student_controller_1.default.createComplaint);
// GET /api/complaints/:id
// View complaint detail
router.get("/:id", student_controller_1.default.getComplaintById);
// DELETE /api/complaints/:id
// Student deletes a complaint
router.delete("/:id", (0, auth_middleware_1.requireRole)("student"), student_controller_1.default.deleteComplaint);
// PATCH /api/complaints/:id
// Admin updates complaint status/resolution
router.patch("/:id", (0, auth_middleware_1.requireRole)("admin"), (0, validateRequest_1.validateRequest)(complaint_validation_1.updateComplaintStatusSchema), complaint_controller_1.default.updateComplaintStatus);
// Compatibility route for admin
router.put("/:id/status", (0, auth_middleware_1.requireRole)("admin"), (0, validateRequest_1.validateRequest)(complaint_validation_1.updateComplaintStatusSchema), complaint_controller_1.default.updateComplaintStatus);
exports.default = router;
