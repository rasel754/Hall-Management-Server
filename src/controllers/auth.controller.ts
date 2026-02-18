// import type { Request, Response } from "express"
// import jwt from "jsonwebtoken"
// import StatusCodes from "http-status-codes"
// import { User } from "../models/user.model"
// import { config } from "../config/index"

// export const registerUser = async (req: Request, res: Response) => {
//   try {
//     const { name, email, password, role } = req.body

//     const existingUser = await User.findOne({ email })
//     if (existingUser) {
//       return res.status(StatusCodes.CONFLICT).json({
//         success: false,
//         message: "Email already registered",
//         data: null,
//       })
//     }

//     const user = await User.create({
//       name,
//       email,
//       password,
//       role: role || "student",
//     })

//     const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: "7d" })

//     return res.status(StatusCodes.CREATED).json({
//       success: true,
//       message: "User registered successfully",
//       data: {
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         },
//         token,
//       },
//     })
//   } catch (error: any) {
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: "Registration failed",
//       data: error.message,
//     })
//   }
// }

// export const loginUser = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body

//     const user = await User.findOne({ email })
//     if (!user) {
//       return res.status(StatusCodes.UNAUTHORIZED).json({
//         success: false,
//         message: "Invalid email or password",
//         data: null,
//       })
//     }

//     if (user.blocked) {
//       return res.status(StatusCodes.FORBIDDEN).json({
//         success: false,
//         message: "Your account has been blocked",
//         data: null,
//       })
//     }

//     const isPasswordValid = await user.comparePassword(password)
//     if (!isPasswordValid) {
//       return res.status(StatusCodes.UNAUTHORIZED).json({
//         success: false,
//         message: "Invalid email or password",
//         data: null,
//       })
//     }

//     const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: "7d" })

//     return res.status(StatusCodes.OK).json({
//       success: true,
//       message: "Login successful",
//       data: {
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         },
//         token,
//       },
//     })
//   } catch (error: any) {
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: "Login failed",
//       data: error.message,
//     })
//   }
// }

// export const getProfile = async (req: Request, res: Response) => {
//   try {
//     const user = await User.findById(req?.user?.id).select("-password")

//     if (!user) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         success: false,
//         message: "User not found",
//         data: null,
//       })
//     }

//     return res.status(StatusCodes.OK).json({
//       success: true,
//       message: "Profile retrieved successfully",
//       data: user,
//     })
//   } catch (error: any) {
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: "Failed to retrieve profile",
//       data: error.message,
//     })
//   }
// }


import type { Request, Response } from "express"
import jwt from "jsonwebtoken"
import StatusCodes from "http-status-codes"
import { User } from "../models/user.model"
import { config } from "../config/index"

// ----------------------------------------------------------------------
// 🎯 FIX: Custom Request Interface to resolve TS2339 error
// ----------------------------------------------------------------------

// 1. Define the structure of the payload attached by the JWT middleware
export interface AuthUserPayload {
  id: string;
  role: "student" | "admin"; // Match the roles in your system
}

// 2. Extend the standard Express Request type
export interface CustomRequest extends Request {
  user?: AuthUserPayload;
}

// ----------------------------------------------------------------------

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "Email already registered",
        data: null,
      })
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "student",
    })

    const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: "7d" })

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    })
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Registration failed",
      data: error.message,
    })
  }
}

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid email or password",
        data: null,
      })
    }

    if (user.blocked) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "Your account has been blocked",
        data: null,
      })
    }

    // Assuming user.comparePassword is a method on the Mongoose model
    const isPasswordValid = await user.comparePassword(password) 
    if (!isPasswordValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid email or password",
        data: null,
      })
    }

    const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: "7d" })

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    })
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Login failed",
      data: error.message,
    })
  }
}

// Change the Request type to CustomRequest here
export const getProfile = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findById(req?.user?.id).select("-password")

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
        data: null,
      })
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Profile retrieved successfully",
      data: user,
    })
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve profile",
      data: error.message,
    })
  }
}