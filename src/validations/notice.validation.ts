import { z } from "zod"

export const createNoticeSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(5, "Content must be at least 5 characters"),
  }),
})

export type CreateNoticeInput = z.infer<typeof createNoticeSchema>
