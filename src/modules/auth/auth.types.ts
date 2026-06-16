import { z } from "zod";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema } from "./auth.validation";

export type IRegisterBody = z.infer<typeof registerSchema>["body"];
export type ILoginBody = z.infer<typeof loginSchema>["body"];
export type IForgotPasswordBody = z.infer<typeof forgotPasswordSchema>["body"];
export type IResetPasswordBody = z.infer<typeof resetPasswordSchema>["body"];
export type IChangePasswordBody = z.infer<typeof changePasswordSchema>["body"];

export interface ITokenPayload {
  id: string;
  email: string;
  role: "student" | "admin";
}
