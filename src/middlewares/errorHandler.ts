import { ErrorRequestHandler } from "express";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || undefined;

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid field format: ${err.path || "id"}`;
  }

  // Handle Mongoose ValidationError
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    errors = Object.keys(err.errors).reduce((acc: any, key) => {
      acc[key] = err.errors[key].message;
      return acc;
    }, {});
  }

  // Handle Mongoose Duplicate Key (11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : "Record";
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
