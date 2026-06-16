/// <reference path="./types/express.d.ts" />
import express, { type Express, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { corsOptions } from "./config/corsOptions";
import { requestLogger } from "./middlewares/requestLogger";
import { apiLimiter } from "./middlewares/rateLimiter";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";
import { env } from "./config/env";

import authRoutes from "./modules/auth/auth.routes";
import studentRoutes from "./modules/student/student.routes";
import adminRoutes from "./modules/admin/admin.routes";
import roomRouter from "./modules/room/room.routes";
import bookingRouter from "./modules/booking/booking.routes";
import complaintRouter from "./modules/complaint/complaint.routes";
import noticeRouter from "./modules/notice/notice.routes";
import userRouter from "./modules/student/user.routes";
import hallRouter from "./modules/hall/hall.routes";

const app: Express = express();

// Security headers & CORS
app.use(helmet());
app.use(cors(corsOptions));

// Parsing body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Morgan logger
app.use(requestLogger);

// Global API rate limiting
app.use("/api", apiLimiter);

// Routing groups
// REST API routes matching client expectations
app.use("/api/auth", authRoutes);
app.use("/api/users", userRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/complaints", complaintRouter);
app.use("/api/notices", noticeRouter);
app.use("/api/halls", hallRouter);
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);

// V1 routes for backward compatibility
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/student", studentRoutes);
app.use("/api/v1/admin", adminRoutes);

// Root path handler
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "University Hall Management API is running!",
    docs: "/health",
  });
});

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date(),
    environment: env.NODE_ENV,
  });
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
