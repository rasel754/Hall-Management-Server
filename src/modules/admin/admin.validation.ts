import { z } from "zod";

export const blockStudentSchema = z.object({
  body: z.object({
    reason: z.string().min(1, "Block reason is required"),
  }),
});
