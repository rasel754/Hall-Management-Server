import { Router } from "express"
import * as authController from "../controllers/auth.controller"
import { validateRequest } from "../middlewares/validateRequest"
import { registerUserSchema, loginUserSchema } from "../validations/user.validation"
import { verifyToken } from "../middlewares/authMiddleware"

const router = Router()

router.post("/register", validateRequest(registerUserSchema), authController.registerUser)
router.post("/login", validateRequest(loginUserSchema), authController.loginUser)
router.get("/me", verifyToken, authController.getProfile)

export default router
