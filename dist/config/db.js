"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const connectDB = async (retries = 5, delay = 5000) => {
    while (retries > 0) {
        try {
            await mongoose_1.default.connect(env_1.env.MONGO_URI);
            console.log("🚀 MongoDB connected successfully");
            return;
        }
        catch (error) {
            console.error(`❌ MongoDB connection failed. Retries left: ${retries - 1}. Retrying in ${delay / 1000}s... Error:`, error);
            retries -= 1;
            if (retries === 0) {
                console.error("❌ Max retries reached. Database connection failed.");
                throw error;
            }
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
};
exports.connectDB = connectDB;
