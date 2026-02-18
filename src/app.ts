import express, { type Express, Request, Response } from "express";
import cors from "cors";
import { config } from "./config/index";
import { errorHandler } from "./middlewares/errorHandler";

const app: Express = express();

app.use(express.json());
app.use(
  cors({
    origin: config.frontendOrigin,
    credentials: true,
  })
);

const authRoutes = require("./routes/auth.routes").default;
const studentRoutes = require("./routes/student.routes").default;
const adminRoutes = require("./routes/admin.routes").default;

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);

// **CRITICAL FIX: Add a default handler for the root path (/)**
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ 
        success: true, 
        message: "University Hall Management API is running!", 
        docs: "/health" 
    });
});

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

app.use(errorHandler);

export default app;
