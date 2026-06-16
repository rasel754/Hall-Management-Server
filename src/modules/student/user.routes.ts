import { Router } from "express";
import { verifyToken, checkBlocked, requireRole } from "../../middlewares/auth.middleware";
import adminController from "../admin/admin.controller";
import studentController from "./student.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateProfileSchema } from "./student.validation";
import { User } from "./student.model";

const router = Router();

router.use(verifyToken, checkBlocked);

// PATCH /api/users/profile
// Student or anyone updates their own profile
router.patch("/profile", validateRequest(updateProfileSchema), studentController.updateProfile);
router.put("/profile", validateRequest(updateProfileSchema), studentController.updateProfile);

// GET /api/users
// Admin gets all users/students list. Without pagination, returns all, with pagination runs getStudentsList
router.get("/", requireRole("admin"), async (req, res, next) => {
  try {
    if (req.query.page || req.query.limit) {
      return adminController.getStudentsList(req, res, next);
    }
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/users/:id/activate
// Admin activates/unblocks user
router.patch("/:id/activate", requireRole("admin"), adminController.unblockStudent);

// PATCH /api/users/:id/deactivate
// Admin deactivates/blocks user
router.patch("/:id/deactivate", requireRole("admin"), adminController.blockStudent);

export default router;
