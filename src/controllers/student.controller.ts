// import type { Request, Response } from "express"
// import StatusCodes from "http-status-codes"
// import { User } from "../models/user.model"
// import { Room } from "../models/room.model"
// import { Complaint } from "../models/complaint.model"
// import { Notice } from "../models/notice.model"
// import { Payment } from "../models/payment.model"

// export const getMyRoom = async (req: Request, res: Response) => {
//   try {
//     const user = await User.findById(req.user?.id).populate("roomId")

//     if (!user?.roomId) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         success: false,
//         message: "No room assigned",
//         data: null,
//       })
//     }

//     return res.status(StatusCodes.OK).json({
//       success: true,
//       message: "Room retrieved successfully",
//       data: user.roomId,
//     })
//   } catch (error: any) {
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: "Failed to retrieve room",
//       data: error.message,
//     })
//   }
// }

// export const bookRoom = async (req: Request, res: Response) => {
//   try {
//     const { roomId } = req.params

//     const room = await Room.findById(roomId)
//     if (!room) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         success: false,
//         message: "Room not found",
//         data: null,
//       })
//     }

//     if (room.occupied >= room.capacity) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         success: false,
//         message: "Room is full",
//         data: null,
//       })
//     }

//     const user = await User.findById(req.user?.id)
//     if (user?.roomId) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         success: false,
//         message: "You already have a room assignment",
//         data: null,
//       })
//     }

//     // Update room occupancy
//     room.occupied += 1
//     room.available = room.occupied < room.capacity
//     await room.save()

//     // Assign room to student
//     user!.roomId = room._id
//     await user!.save()

//     return res.status(StatusCodes.OK).json({
//       success: true,
//       message: "Room booked successfully",
//       data: room,
//     })
//   } catch (error: any) {
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: "Failed to book room",
//       data: error.message,
//     })
//   }
// }

// export const cancelSeat = async (req: Request, res: Response) => {
//   try {
//     const user = await User.findById(req.user?.id)

//     if (!user?.roomId) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         success: false,
//         message: "No room assigned",
//         data: null,
//       })
//     }

//     const room = await Room.findById(user.roomId)
//     if (room) {
//       room.occupied = Math.max(0, room.occupied - 1)
//       room.available = room.occupied < room.capacity
//       await room.save()
//     }

//     user.roomId = undefined
//     await user.save()

//     return res.status(StatusCodes.OK).json({
//       success: true,
//       message: "Seat cancelled successfully",
//       data: null,
//     })
//   } catch (error: any) {
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: "Failed to cancel seat",
//       data: error.message,
//     })
//   }
// }

// export const getMyComplaints = async (req: Request, res: Response) => {
//   try {
//     const complaints = await Complaint.find({ studentId: req.user?.id })

//     return res.status(StatusCodes.OK).json({
//       success: true,
//       message: "Complaints retrieved successfully",
//       data: complaints,
//     })
//   } catch (error: any) {
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: "Failed to retrieve complaints",
//       data: error.message,
//     })
//   }
// }

// export const submitComplaint = async (req: Request, res: Response) => {
//   try {
//     const { title, description } = req.body

//     const complaint = await Complaint.create({
//       title,
//       description,
//       studentId: req.user?.id,
//     })

//     return res.status(StatusCodes.CREATED).json({
//       success: true,
//       message: "Complaint submitted successfully",
//       data: complaint,
//     })
//   } catch (error: any) {
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: "Failed to submit complaint",
//       data: error.message,
//     })
//   }
// }

// export const getNotices = async (req: Request, res: Response) => {
//   try {
//     const notices = await Notice.find().sort({ createdAt: -1 })

//     return res.status(StatusCodes.OK).json({
//       success: true,
//       message: "Notices retrieved successfully",
//       data: notices,
//     })
//   } catch (error: any) {
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: "Failed to retrieve notices",
//       data: error.message,
//     })
//   }
// }

// export const getMyPayments = async (req: Request, res: Response) => {
//   try {
//     const payments = await Payment.find({ studentId: req.user?.id }).sort({ createdAt: -1 })

//     return res.status(StatusCodes.OK).json({
//       success: true,
//       message: "Payments retrieved successfully",
//       data: payments,
//     })
//   } catch (error: any) {
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: "Failed to retrieve payments",
//       data: error.message,
//     })
//   }
// }

// export const payRent = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params

//     const payment = await Payment.findById(id)
//     if (!payment) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         success: false,
//         message: "Payment not found",
//         data: null,
//       })
//     }

//     if (payment.studentId.toString() !== req.user?.id) {
//       return res.status(StatusCodes.FORBIDDEN).json({
//         success: false,
//         message: "Not authorized to pay this rent",
//         data: null,
//       })
//     }

//     payment.status = "Paid"
//     await payment.save()

//     return res.status(StatusCodes.OK).json({
//       success: true,
//       message: "Rent paid successfully",
//       data: payment,
//     })
//   } catch (error: any) {
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: "Failed to pay rent",
//       data: error.message,
//     })
//   }
// }




import type { Response } from "express"
import StatusCodes from "http-status-codes"
import { User } from "../models/user.model"
import { Room } from "../models/room.model"
import { Complaint } from "../models/complaint.model"
import { Notice } from "../models/notice.model"
import { Payment } from "../models/payment.model"
// 🎯 FIX 1: Import CustomRequest type from authMiddleware
import { CustomRequest } from "../middlewares/authMiddleware"; 
// Assuming ObjectId type is available from Mongoose (or BSON) for clarity
import type { Types } from "mongoose"; 

// 🎯 FIX 1: Apply CustomRequest to all controllers
export const getMyRoom = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).populate("roomId")

    if (!user?.roomId) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No room assigned",
        data: null,
      })
    }

    // Since `user.roomId` is populated, the data is the Room object, not just the ID.
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Room retrieved successfully",
      data: user.roomId,
    })
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve room",
      data: error.message,
    })
  }
}

// 🎯 FIX 1: Apply CustomRequest to all controllers
export const bookRoom = async (req: CustomRequest, res: Response) => {
  try {
    const { roomId } = req.params

    const room = await Room.findById(roomId)
    if (!room) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Room not found",
        data: null,
      })
    }

    if (room.occupied >= room.capacity) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Room is full",
        data: null,
      })
    }

    const user = await User.findById(req.user?.id)
    if (user?.roomId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "You already have a room assignment",
        data: null,
      })
    }

    // Update room occupancy
    room.occupied += 1
    room.available = room.occupied < room.capacity
    await room.save()

    // Assign room to student
    // 🎯 FIX 2: Explicitly cast room._id to resolve TS2322 (Type 'unknown')
    user!.roomId = room._id as Types.ObjectId | undefined; 
    await user!.save()

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Room booked successfully",
      data: room,
    })
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to book room",
      data: error.message,
    })
  }
}

// 🎯 FIX 1: Apply CustomRequest to all controllers
export const cancelSeat = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id)

    if (!user?.roomId) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No room assigned",
        data: null,
      })
    }

    const room = await Room.findById(user.roomId)
    if (room) {
      room.occupied = Math.max(0, room.occupied - 1)
      room.available = room.occupied < room.capacity
      await room.save()
    }

    // Mongoose handles undefined assignment correctly for ObjectIds
    user.roomId = undefined 
    await user.save()

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Seat cancelled successfully",
      data: null,
    })
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to cancel seat",
      data: error.message,
    })
  }
}

// 🎯 FIX 1: Apply CustomRequest to all controllers
export const getMyComplaints = async (req: CustomRequest, res: Response) => {
  try {
    const complaints = await Complaint.find({ studentId: req.user?.id })

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Complaints retrieved successfully",
      data: complaints,
    })
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve complaints",
      data: error.message,
    })
  }
}

// 🎯 FIX 1: Apply CustomRequest to all controllers
export const submitComplaint = async (req: CustomRequest, res: Response) => {
  try {
    const { title, description } = req.body

    const complaint = await Complaint.create({
      title,
      description,
      studentId: req.user?.id,
    })

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Complaint submitted successfully",
      data: complaint,
    })
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to submit complaint",
      data: error.message,
    })
  }
}

// 🎯 FIX 3: Change req to _req to suppress TS6133 (Unused variable)
export const getNotices = async (_req: CustomRequest, res: Response) => { 
  try {
    const notices = await Notice.find().sort({ createdAt: -1 })

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Notices retrieved successfully",
      data: notices,
    })
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve notices",
      data: error.message,
    })
  }
}

// 🎯 FIX 1: Apply CustomRequest to all controllers
export const getMyPayments = async (req: CustomRequest, res: Response) => {
  try {
    const payments = await Payment.find({ studentId: req.user?.id }).sort({ createdAt: -1 })

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Payments retrieved successfully",
      data: payments,
    })
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve payments",
      data: error.message,
    })
  }
}

// 🎯 FIX 1: Apply CustomRequest to all controllers
export const payRent = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params

    const payment = await Payment.findById(id)
    if (!payment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Payment not found",
        data: null,
      })
    }

    if (payment.studentId.toString() !== req.user?.id) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "Not authorized to pay this rent",
        data: null,
      })
    }

    payment.status = "Paid"
    await payment.save()

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Rent paid successfully",
      data: payment,
    })
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to pay rent",
      data: error.message,
    })
  }
}