// src/server.ts
import mongoose from "mongoose";
import { config } from "./config";
import app from "./app";
import type { VercelRequest, VercelResponse } from '@vercel/node';

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(config.mongoUri);
  isConnected = true;
  console.log("MongoDB connected");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectDB();
  return app(req, res); 
}
