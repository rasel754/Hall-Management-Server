import type { Request, Response } from "express"
import StatusCodes from "http-status-codes"
import { User } from "../models/user.model"
import { Room } from "../models/room.model"
import { Complaint } from "../models/complaint.model"
import { Notice } from "../models/notice.model"
import { Payment } from "../models/payment.model"

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" })
    const totalRooms = await Room.countDocuments()
    const occupiedRooms = await Room.countDocuments({ available: false })
    const pendingPayments = await Payment.countDocuments({ status: "Pending" })
    const pendingComplaints = await Complaint.countDocuments({ status: "Pending" })

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Dashboard data retrieved successfully",
      data: {
        totalStudents,
        totalRooms,
        occupiedRooms,
        pendingPayments,
        pendingComplaints,
      },
    })
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve dashboard data",
      data: error.message,
    })
  }
}

export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await Room.find()

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Rooms retrieved successfully",
      data: rooms,
    })
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve rooms",
      data: error.message,
    })
  }
}

export const approveBooking = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params

    const room = await Room.findByIdAndUpdate(roomId, { available: true }, { new: true })

    if (!room) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Room not found",
        data: null,
      })
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Booking approved successfully",
      data: room,
    })
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to approve booking",
      data: error.message,
    })
  }
}

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await User.find({ role: "student" }).select("-password").populate("roomId")

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Students retrieved successfully",
      data: students,
    })
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve students",
      data: error.message,
    })
  }
}

export const publishNotice = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body

    const notice = await Notice.create({ title, content })

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Notice published successfully",
      data: notice,
    })
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to publish notice",
      data: error.message,
    })
  }
}

export const blockUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const user = await User.findById(id)
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
        data: null,
      })
    }

    user.blocked = !user.blocked
    await user.save()

    return res.status(StatusCodes.OK).json({
      success: true,
      message: `User ${user.blocked ? "blocked" : "unblocked"} successfully`,
      data: user,
    })
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to block/unblock user",
      data: error.message,
    })
  }
}

export const solveComplaint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const complaint = await Complaint.findByIdAndUpdate(id, { status: "Solved" }, { new: true })

    if (!complaint) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Complaint not found",
        data: null,
      })
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Complaint marked as solved",
      data: complaint,
    })
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to solve complaint",
      data: error.message,
    })
  }
}

export const getAvailableRooms = async (req: Request, res: Response) => {
  try {
    const availableRooms = await Room.find({ available: true })

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Available rooms retrieved successfully",
      data: availableRooms,
    })
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve available rooms",
      data: error.message,
    })
  }
}
