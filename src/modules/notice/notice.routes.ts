import { Router } from "express";
import noticeController from "./notice.controller";
import studentController from "../student/student.controller";
import { verifyToken, checkBlocked, requireRole } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { createNoticeSchema, updateNoticeSchema } from "./notice.validation";

const router = Router();

router.use(verifyToken, checkBlocked);

// GET /api/notices
// Admin gets all notices (including inactive ones), student gets only active notices
router.get("/", (req, res, next) => {
  if (req.user?.role === "admin") {
    return noticeController.getNotices(req, res, next);
  } else {
    return studentController.getActiveNotices(req, res, next);
  }
});

// Admin only routes
router.post("/", requireRole("admin"), validateRequest(createNoticeSchema), noticeController.createNotice);
router.put("/:id", requireRole("admin"), validateRequest(updateNoticeSchema), noticeController.updateNotice);
router.patch("/:id", requireRole("admin"), validateRequest(updateNoticeSchema), noticeController.updateNotice);
router.delete("/:id", requireRole("admin"), noticeController.deleteNotice);
router.put("/:id/toggle", requireRole("admin"), noticeController.toggleNoticeActive);

export default router;
