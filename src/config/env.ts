import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  FRONTEND_ORIGIN: z.string().default("https://hall-mangement-client.vercel.app,http://localhost:5173"),
  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z.coerce.number().optional(),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
  EMAIL_FROM: z.string().optional().default("noreply@hallms.com"),
});

const parsed = envSchema.safeParse(process.env);

export const envError = parsed.success ? null : parsed.error;
export const env = parsed.success ? parsed.data : {} as z.infer<typeof envSchema>;

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", JSON.stringify(parsed.error.format(), null, 2));
  if (!process.env.VERCEL) {
    process.exit(1);
  }
}

