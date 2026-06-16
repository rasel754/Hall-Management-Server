import { z } from "zod";

export const createNoticeSchema = z.object({
  body: z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(150, "Title must be less than 150 characters"),
    content: z.string().min(20, "Content must be at least 20 characters").max(5000, "Content must be less than 5000 characters"),
    category: z.enum(["general", "urgent", "academic", "maintenance"]),
    expiryDate: z.string().or(z.date()).transform((val) => new Date(val)).optional(),
  }),
});

export const updateNoticeSchema = z.object({
  body: z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(150, "Title must be less than 150 characters").optional(),
    content: z.string().min(20, "Content must be at least 20 characters").max(5000, "Content must be less than 5000 characters").optional(),
    category: z.enum(["general", "urgent", "academic", "maintenance"]).optional(),
    expiryDate: z.string().or(z.date()).transform((val) => new Date(val)).optional(),
    isActive: z.boolean().optional(),
  }),
});
