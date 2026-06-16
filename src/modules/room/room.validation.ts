import { z } from "zod";

export const createRoomSchema = z.object({
  body: z.object({
    roomNumber: z.string().min(1, "Room number is required"),
    floor: z.coerce.number().min(0, "Floor must be 0 or higher"),
    type: z.enum(["single", "double", "triple"]),
    capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
    pricePerMonth: z.coerce.number().min(0, "Price per month must be positive"),
    facilities: z.array(z.string()).default([]),
    images: z.array(z.string()).default([]),
  }),
});

export const updateRoomSchema = z.object({
  body: z.object({
    roomNumber: z.string().min(1, "Room number is required").optional(),
    floor: z.coerce.number().min(0, "Floor must be 0 or higher").optional(),
    type: z.enum(["single", "double", "triple"]).optional(),
    capacity: z.coerce.number().min(1, "Capacity must be at least 1").optional(),
    pricePerMonth: z.coerce.number().min(0, "Price per month must be positive").optional(),
    facilities: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
    status: z.enum(["available", "occupied", "full", "maintenance"]).optional(),
  }),
});

export const updateRoomStatusSchema = z.object({
  body: z.object({
    status: z.enum(["available", "occupied", "full", "maintenance"]),
  }),
});
