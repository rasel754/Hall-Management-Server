import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be 2 to 50 characters").max(50, "Name must be 2 to 50 characters"),
    email: z.string().email("Invalid email format").toLowerCase(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    studentId: z.string().min(1, "Student ID is required").trim(),
    department: z.string().min(1, "Department is required").trim(),
    year: z.coerce.number().min(1, "Year must be between 1 and 4").max(4, "Year must be between 1 and 4"),
    phone: z.string().min(1, "Phone number is required").trim(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format").toLowerCase(),
    password: z.string().min(1, "Password is required"),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format").toLowerCase(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
  }),
});
