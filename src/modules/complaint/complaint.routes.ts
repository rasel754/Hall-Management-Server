import { Router } from "express";
import complaintController from "./complaint.controller";
import studentController from "../student/student.controller";
import { verifyToken, checkBlocked, requireRole } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateComplaintStatusSchema } from "./complaint.validation";
import { createComplaintSchema } from "../student/student.validation";

const router = Router();

router.use(verifyToken, checkBlocked);

// GET /api/complaints
// Admin gets all complaints, student gets own complaints
router.get("/", (req, res, next) => {
  if (req.user?.role === "admin") {
    return complaintController.getComplaints(req, res, next);
  } else {
    return studentController.getComplaints(req, res, next);
  }
});

// POST /api/complaints
// Student creates a complaint
router.post("/", requireRole("student"), validateRequest(createComplaintSchema), studentController.createComplaint);

// GET /api/complaints/:id
// View complaint detail
router.get("/:id", studentController.getComplaintById);

// DELETE /api/complaints/:id
// Student deletes a complaint
router.delete("/:id", requireRole("student"), studentController.deleteComplaint);

// PATCH /api/complaints/:id
// Admin updates complaint status/resolution
router.patch("/:id", requireRole("admin"), validateRequest(updateComplaintStatusSchema), complaintController.updateComplaintStatus);

// Compatibility route for admin
router.put("/:id/status", requireRole("admin"), validateRequest(updateComplaintStatusSchema), complaintController.updateComplaintStatus);

export default router;
