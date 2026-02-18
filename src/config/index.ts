import dotenv from "dotenv"

dotenv.config()

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/university_hall",
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
}
