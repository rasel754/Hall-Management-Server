import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ApiResponse } from "../../utils/ApiResponse";
import authService from "./auth.service";
import { User } from "../student/student.model";
import { ApiError } from "../../utils/ApiError";

export const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerStudent(req.body);
  res.status(201).json(new ApiResponse("Student registered successfully", result));
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);
  res.status(200).json(new ApiResponse("Login successful", result));
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  res.status(200).json(new ApiResponse("Logout successful", null));
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.forgotPassword(req.body.email);
  res.status(200).json(new ApiResponse("Password reset email sent successfully", null));
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.params;
  await authService.resetPassword(token, req.body.password);
  res.status(200).json(new ApiResponse("Password reset successfully", null));
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.status(200).json(new ApiResponse("Profile fetched successfully", user));
});

export const changePassword = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
  await authService.changePassword(req.user.id, req.body);
  res.status(200).json(new ApiResponse("Password changed successfully", null));
});

export default {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
  changePassword,
};
