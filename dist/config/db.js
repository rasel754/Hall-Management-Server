"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const connectDB = async (retries = 5, delay = 5000) => {
    // If already connected, reuse the connection
    if (mongoose_1.default.connection.readyState === 1) {
        return;
    }
    // In a Vercel serverless environment, do not retry with long delays to avoid timeouts
    const isServerless = !!process.env.VERCEL;
    const maxRetries = isServerless ? 1 : retries;
    const retryDelay = isServerless ? 1000 : delay;
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            await mongoose_1.default.connect(env_1.env.MONGO_URI);
            console.log("🚀 MongoDB connected successfully");
            return;
        }
        catch (error) {
            attempt += 1;
            console.error(`❌ MongoDB connection failed (Attempt ${attempt}/${maxRetries}). Error:`, error);
            if (attempt >= maxRetries) {
                console.error("❌ Max retries reached. Database connection failed.");
                throw error;
            }
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
    }
};
exports.connectDB = connectDB;
