import type { Request, Response, NextFunction } from "express"
import StatusCodes from "http-status-codes"

export interface ApiError extends Error {
  status?: number
}

export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR
  const message = err.message || "Internal server error"

  console.error(`[Error] ${status}: ${message}`)

  return res.status(status).json({
    success: false,
    message,
    data: null,
  })
}
