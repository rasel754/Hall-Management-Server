import { Router } from "express";
import authController from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema } from "./auth.validation";
import { verifyToken, checkBlocked } from "../../middlewares/auth.middleware";
import { authLimiter } from "../../middlewares/rateLimiter";

const router = Router();

router.use(authLimiter);

router.post("/register", validateRequest(registerSchema), authController.register);
router.post("/login", validateRequest(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.post("/forgot-password", validateRequest(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password/:token", validateRequest(resetPasswordSchema), authController.resetPassword);

router.get("/me", verifyToken, checkBlocked, authController.getMe);
router.put("/change-password", verifyToken, checkBlocked, validateRequest(changePasswordSchema), authController.changePassword);

export default router;
