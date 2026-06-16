import mongoose from "mongoose";
import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import type { VercelRequest, VercelResponse } from "@vercel/node";

let server: any;

async function startServer() {
  try {
    await connectDB();
    
    if (env.NODE_ENV !== "production" || !process.env.VERCEL) {
      server = app.listen(env.PORT, () => {
        console.log(`🚀 Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
      });
    }
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

const gracefulShutdown = async (signal: string) => {
  console.log(`\n⚠️ ${signal} received. Initiating graceful shutdown...`);
  
  if (server) {
    server.close(() => {
      console.log("🔒 HTTP server closed.");
    });
  }

  try {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error closing MongoDB connection:", err);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectDB();
  return app(req, res);
}
