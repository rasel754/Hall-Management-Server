import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      req.body = parsed.body;
      if (parsed.query) {
        Object.defineProperty(req, "query", {
          value: parsed.query,
          writable: true,
          configurable: true,
          enumerable: true,
        });
      }
      if (parsed.params) {
        Object.defineProperty(req, "params", {
          value: parsed.params,
          writable: true,
          configurable: true,
          enumerable: true,
        });
      }
      next();
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.format ? error.format() : error.errors || error.message,
      });
    }
  };
};
