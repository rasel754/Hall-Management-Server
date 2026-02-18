// import type { Request, Response, NextFunction } from "express"
// import jwt from "jsonwebtoken"
// import { config } from "../config/index"
// import StatusCodes from "http-status-codes"
// import { AuthUserPayload } from "../controllers/auth.controller";


// export interface CustomRequest extends Request {
//   user?: AuthUserPayload & jwt.JwtPayload; 
// }

// export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.headers.authorization?.split(" ")[1]

//   if (!token) {
//     return res.status(StatusCodes.UNAUTHORIZED).json({
//       success: false,
//       message: "No token provided",
//       data: null,
//     })
//   }

//   try {
//     const decoded = jwt.verify(token, config.jwtSecret)
//     req.user = decoded as any
//     next()
//   } catch (error) {
//     return res.status(StatusCodes.UNAUTHORIZED).json({
//       success: false,
//       message: "Invalid or expired token",
//       data: null,
//     })
//   }
// }

// export const verifyStudent = (req: Request, res: Response, next: NextFunction) => {
//   verifyToken(req, res, () => {
//     if (req.user?.role === "student") {
//       next()
//     } else {
//       return res.status(StatusCodes.FORBIDDEN).json({
//         success: false,
//         message: "Access denied. Students only.",
//         data: null,
//       })
//     }
//   })
// }

// export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
//   verifyToken(req, res, () => {
//     if (req.user?.role === "admin") {
//       next()
//     } else {
//       return res.status(StatusCodes.FORBIDDEN).json({
//         success: false,
//         message: "Access denied. Admins only.",
//         data: null,
//       })
//     }
//   })
// }



import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import StatusCodes from "http-status-codes"
import { config } from "../config/index"
// Assuming AuthUserPayload is available and exported from this location
import { AuthUserPayload } from "../controllers/auth.controller"; 


// Define the CustomRequest interface locally, ensuring it has the 'user' property
export interface CustomRequest extends Request {
  user?: AuthUserPayload & jwt.JwtPayload; 
}


export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "No token provided",
      data: null,
    })
  }
  
  // REMOVE the external declaration of 'decoded' and declare it inside 'try'
  // to prevent TS2454, or initialize it. We'll initialize it to null/undefined
  // and update the type to include null/undefined, or we put the declaration
  // inside the try block and handle the catch.

  try {
    // 🎯 FIX: Declare 'decoded' *inside* the try block using 'const' 
    // This resolves TS2454 (Used before assignment) and TS7022 (Implicit Any)
    const decoded = jwt.verify(token, config.jwtSecret) as AuthUserPayload & jwt.JwtPayload;
    
    // Typecast 'req' to CustomRequest before assigning 'user'
    // TypeScript will now correctly track the 'decoded' variable scope
    (req as CustomRequest).user = decoded;
    
    return next() 
    
  } catch (error) {
    // The previous error related to 'decoded' being non-callable was a 
    // secondary effect of the scoping issue, which this fix resolves.
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Invalid or expired token",
      data: null,
    })
  }
}

// Ensure the request object is cast/defined properly for subsequent middlewares
export const verifyStudent = (req: Request, res: Response, next: NextFunction) => {
  // Use CustomRequest cast for accessing 'user' inside the callback
  const customReq = req as CustomRequest;

  // Explicitly return the result of verifyToken call
  return verifyToken(req, res, () => { 
    if (customReq.user?.role === "student") {
      return next() 
    } else {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "Access denied. Students only.",
        data: null,
      })
    }
  })
}

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Use CustomRequest cast for accessing 'user' inside the callback
  const customReq = req as CustomRequest;

  // Explicitly return the result of verifyToken call
  return verifyToken(req, res, () => { 
    if (customReq.user?.role === "admin") {
      return next()
    } else {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "Access denied. Admins only.",
        data: null,
      })
    }
  })
}