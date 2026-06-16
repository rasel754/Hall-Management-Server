import { z } from "zod";

export const rejectBookingSchema = z.object({
  body: z.object({
    reason: z.string().min(1, "Reason for rejection is required"),
  }),
});
