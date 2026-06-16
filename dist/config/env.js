"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.coerce.number().default(5000),
    NODE_ENV: zod_1.z.enum(["development", "production", "test"]).default("development"),
    MONGO_URI: zod_1.z.string().min(1, "MONGO_URI is required"),
    JWT_SECRET: zod_1.z.string().min(1, "JWT_SECRET is required"),
    JWT_EXPIRES_IN: zod_1.z.string().default("7d"),
    FRONTEND_ORIGIN: zod_1.z.string().default("http://localhost:5173"),
    EMAIL_HOST: zod_1.z.string().optional(),
    EMAIL_PORT: zod_1.z.coerce.number().optional(),
    EMAIL_USER: zod_1.z.string().optional(),
    EMAIL_PASS: zod_1.z.string().optional(),
    EMAIL_FROM: zod_1.z.string().optional().default("noreply@hallms.com"),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("❌ Invalid environment variables:", JSON.stringify(parsed.error.format(), null, 2));
    process.exit(1);
}
exports.env = parsed.data;
