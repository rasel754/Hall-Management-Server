import { z } from "zod"

export const paymentSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Payment ID is required"),
  }),
})

export type PaymentInput = z.infer<typeof paymentSchema>
