import mongoose from "mongoose";
import { env } from "./env";

export const connectDB = async (retries = 5, delay = 5000): Promise<void> => {
  while (retries > 0) {
    try {
      await mongoose.connect(env.MONGO_URI);
      console.log("🚀 MongoDB connected successfully");
      return;
    } catch (error) {
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
