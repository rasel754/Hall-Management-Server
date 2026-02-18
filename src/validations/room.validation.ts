import { z } from "zod"

export const createRoomSchema = z.object({
  body: z.object({
    number: z.string().min(1, "Room number is required"),
    capacity: z.number().positive("Capacity must be positive"),
  }),
})

export const approveBookingSchema = z.object({
  params: z.object({
    roomId: z.string().min(1, "Room ID is required"),
  }),
})

export type CreateRoomInput = z.infer<typeof createRoomSchema>
