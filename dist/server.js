"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const env_1 = require("./config/env");
let server;
async function startServer() {
    try {
        await (0, db_1.connectDB)();
        server = app_1.default.listen(env_1.env.PORT, () => {
            console.log(`🚀 Server is running on port ${env_1.env.PORT} in ${env_1.env.NODE_ENV} mode`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}
// Start the HTTP server locally (not in a Vercel serverless environment)
if (!process.env.VERCEL) {
    startServer();
}
const gracefulShutdown = async (signal) => {
    console.log(`\n⚠️ ${signal} received. Initiating graceful shutdown...`);
    if (server) {
        server.close(() => {
            console.log("🔒 HTTP server closed.");
        });
    }
    try {
        await mongoose_1.default.connection.close();
        console.log("🔌 MongoDB connection closed.");
        process.exit(0);
    }
    catch (err) {
        console.error("❌ Error closing MongoDB connection:", err);
        process.exit(1);
    }
};
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
exports.default = app_1.default;
