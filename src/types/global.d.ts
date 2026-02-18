// import type { JwtPayload } from "jsonwebtoken"

// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         id: string
//         role: "student" | "admin"
//       } & JwtPayload
//     }
//   }
// }
// src/types/global.d.ts

// 1. Import necessary types
import type { Request } from "express"; // Import Request explicitly
import type { JwtPayload } from "jsonwebtoken"; // Import JwtPayload

// 2. Augment the correct module: 'express-serve-static-core'
// This ensures that the 'user' property is added to the Request type used by Express.
declare module "express-serve-static-core" {
  // Define the interface that your JWT middleware attaches to req.user
  interface AuthUser {
    id: string;
    role: "student" | "admin";
  }

  // Extend the Request interface
  interface Request {
    // The 'user' property will contain your custom payload merged with standard JwtPayload properties (like iat, exp).
    user?: AuthUser & JwtPayload; 
    // If you only need 'id' and 'role', you can simplify to: user?: AuthUser;
  }
}

// Ensure the `declare global` block is removed or simplified if not strictly needed for other global types.