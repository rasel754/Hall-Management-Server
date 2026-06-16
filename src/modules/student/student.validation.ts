import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50).optional(),
    phone: z.string().optional(),
    department: z.string().optional(),
    year: z.coerce.number().min(1).max(4).optional(),
    avatar: z.string().optional(),
    emergencyContact: z
      .object({
        name: z.string().default(""),
        phone: z.string().default(""),
        relation: z.string().default(""),
      })
      .optional(),
  }),
});

export const createBookingSchema = z.object({
  body: z.object({
    roomId: z.string().min(1, "roomId is required"),
    moveInDate: z.string().or(z.date()).transform((val) => new Date(val)),
  }),
});

export const createComplaintSchema = z.object({
  body: z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
    category: z.enum(["maintenance", "noise", "cleanliness", "security", "other"]),
    description: z.string().min(20, "Description must be at least 20 characters").max(1000, "Description must be less than 1000 characters"),
    image: z.string().optional(),
  }),
});
