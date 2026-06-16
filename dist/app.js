"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="./types/express.d.ts" />
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const corsOptions_1 = require("./config/corsOptions");
const requestLogger_1 = require("./middlewares/requestLogger");
const rateLimiter_1 = require("./middlewares/rateLimiter");
const notFound_1 = require("./middlewares/notFound");
const errorHandler_1 = require("./middlewares/errorHandler");
const env_1 = require("./config/env");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const student_routes_1 = __importDefault(require("./modules/student/student.routes"));
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes"));
const room_routes_1 = __importDefault(require("./modules/room/room.routes"));
const booking_routes_1 = __importDefault(require("./modules/booking/booking.routes"));
const complaint_routes_1 = __importDefault(require("./modules/complaint/complaint.routes"));
const notice_routes_1 = __importDefault(require("./modules/notice/notice.routes"));
const user_routes_1 = __importDefault(require("./modules/student/user.routes"));
const hall_routes_1 = __importDefault(require("./modules/hall/hall.routes"));
const app = (0, express_1.default)();
// Security headers & CORS
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)(corsOptions_1.corsOptions));
// Parsing body
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Morgan logger
app.use(requestLogger_1.requestLogger);
// Global API rate limiting
app.use("/api", rateLimiter_1.apiLimiter);
// Routing groups
// REST API routes matching client expectations
app.use("/api/auth", auth_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/rooms", room_routes_1.default);
app.use("/api/bookings", booking_routes_1.default);
app.use("/api/complaints", complaint_routes_1.default);
app.use("/api/notices", notice_routes_1.default);
app.use("/api/halls", hall_routes_1.default);
app.use("/api/student", student_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
// V1 routes for backward compatibility
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/student", student_routes_1.default);
app.use("/api/v1/admin", admin_routes_1.default);
// Root path handler
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "University Hall Management API is running!",
        docs: "/health",
    });
});
// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
        timestamp: new Date(),
        environment: env_1.env.NODE_ENV,
    });
});
// Error handlers
app.use(notFound_1.notFound);
app.use(errorHandler_1.errorHandler);
exports.default = app;
