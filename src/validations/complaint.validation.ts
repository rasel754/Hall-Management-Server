import { z } from "zod"

export const createComplaintSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(5, "Description must be at least 5 characters"),
  }),
})

export const solveComplaintSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Complaint ID is required"),
  }),
})

export type CreateComplaintInput = z.infer<typeof createComplaintSchema>
