import type { Request, Response, NextFunction } from "express"
import type { ZodSchema } from "zod"
import StatusCodes from "http-status-codes"

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      })
      return next()
    } catch (error: any) {
      const formattedErrors = error.errors.map((err: any) => ({
        path: err.path.join("."),
        message: err.message,
      }))

      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Validation failed",
        data: formattedErrors,
      })
    }
  }
}
