import { z } from "zod";

export const updatePaymentStatusSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "paid", "overdue"]),
  }),
});
