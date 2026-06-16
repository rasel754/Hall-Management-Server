import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { User } from "../modules/student/student.model";

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Access token is missing or invalid");
    }

    const token = authHeader.split(" ")[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      throw new ApiError(401, "Access token is invalid or expired");
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, "User no longer exists");
    }

    req.user = {
      id: (user._id as any).toString(),
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new ApiError(401, "Authentication required");
      }

      if (!roles.includes(req.user.role)) {
        throw new ApiError(403, "You do not have permission to perform this action");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const checkBlocked = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    if (req.user.isBlocked) {
      throw new ApiError(403, "Account has been blocked");
    }

    next();
  } catch (error) {
    next(error);
  }
};
