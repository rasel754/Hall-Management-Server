import { z } from "zod";

export const updateComplaintStatusSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "in_progress", "resolved"]),
    adminNote: z.string().optional(),
  }),
});
