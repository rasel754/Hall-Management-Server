"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const env_1 = require("./env");
exports.corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
            return callback(null, true);
        }
        const allowedOrigins = env_1.env.FRONTEND_ORIGIN.split(",").map((o) => o.trim());
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error(`Not allowed by CORS: ${origin}`));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    optionsSuccessStatus: 200,
};
