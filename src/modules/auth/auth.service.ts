import jwt from "jsonwebtoken";
import { User } from "../student/student.model";
import { ApiError } from "../../utils/ApiError";
import { env } from "../../config/env";
import { sendEmail } from "../../utils/sendEmail";
import { IRegisterBody, ILoginBody } from "./auth.types";

export const registerStudent = async (body: IRegisterBody) => {
  const existingEmail = await User.findOne({ email: body.email });
  if (existingEmail) {
    throw new ApiError(409, "Email is already registered");
  }

  if (body.studentId) {
    const existingStudentId = await User.findOne({ studentId: body.studentId });
    if (existingStudentId) {
      throw new ApiError(409, "Student ID is already registered");
    }
  }

  const user = await User.create({
    ...body,
    role: "student",
  });

  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

export const loginUser = async (body: ILoginBody) => {
  const user = await User.findOne({ email: body.email }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await user.comparePassword(body.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (user.isBlocked) {
    throw new ApiError(403, "Account has been blocked");
  }

  const token = jwt.sign(
    { id: (user._id as any).toString(), email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as any }
  );

  const userObject = user.toObject();
  delete userObject.password;

  return { token, user: userObject };
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found with this email");
  }

  const resetToken = jwt.sign(
    { id: (user._id as any).toString(), type: "password-reset" },
    env.JWT_SECRET,
    { expiresIn: "15m" as any }
  );

  const resetUrl = `${env.FRONTEND_ORIGIN}/reset-password/${resetToken}`;

  const html = `
    <h1>Password Reset Request</h1>
    <p>You requested to reset your password. Please click the link below to set a new password:</p>
    <a href="${resetUrl}" target="_blank">${resetUrl}</a>
    <p>This link will expire in 15 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
  `;

  await sendEmail(user.email, "Reset Your Password - Hall Management System", html);
};

export const resetPassword = async (token: string, newPassword: string) => {
  let decoded: any;
  try {
    decoded = jwt.verify(token, env.JWT_SECRET);
  } catch (error) {
    throw new ApiError(400, "Reset token is invalid or expired");
  }

  if (decoded.type !== "password-reset") {
    throw new ApiError(400, "Invalid token type");
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.password = newPassword;
  await user.save();
};

export const changePassword = async (userId: string, body: any) => {
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await user.comparePassword(body.currentPassword);
  if (!isMatch) {
    throw new ApiError(400, "Current password is incorrect");
  }

  user.password = body.newPassword;
  await user.save();
};
export default {
  registerStudent,
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword,
};
