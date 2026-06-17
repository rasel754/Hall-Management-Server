import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ApiResponse } from "../../utils/ApiResponse";
import studentService from "./student.service";
import { getPaginationParams, getPaginationMeta } from "../../utils/pagination";
import { ApiError } from "../../utils/ApiError";

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await studentService.getProfile(req.user!.id);
  res.status(200).json(new ApiResponse("Profile fetched successfully", result));
});

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await studentService.updateProfile(req.user!.id, req.body);
  res.status(200).json(new ApiResponse("Profile updated successfully", result));
});

export const getCurrentRoom = catchAsync(async (req: Request, res: Response) => {
  const result = await studentService.getCurrentRoom(req.user!.id);
  res.status(200).json(new ApiResponse("Current room assignment fetched successfully", result));
});

export const getBookings = catchAsync(async (req: Request, res: Response) => {
  const result = await studentService.getBookings(req.user!.id);
  res.status(200).json(new ApiResponse("Booking history fetched successfully", result));
});

export const createBookingRequest = catchAsync(async (req: Request, res: Response) => {
  const { roomId, moveInDate, startDate } = req.body;
  const finalMoveInDate = new Date(moveInDate || startDate || Date.now());
  const result = await studentService.createBookingRequest(req.user!.id, roomId, finalMoveInDate);
  res.status(201).json(new ApiResponse("Booking request created successfully", result));
});

export const cancelBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await studentService.cancelBooking(req.user!.id, req.params.id);
  res.status(200).json(new ApiResponse("Booking cancelled successfully", result));
});

export const getComplaints = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const filter: any = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  const { data, total } = await studentService.getComplaints(req.user!.id, filter, page, limit, skip);
  const meta = getPaginationMeta(total, page, limit);
  res.status(200).json(new ApiResponse("Complaints fetched successfully", data, meta));
});

export const createComplaint = catchAsync(async (req: Request, res: Response) => {
  const result = await studentService.createComplaint(req.user!.id, req.body);
  res.status(201).json(new ApiResponse("Complaint submitted successfully", result));
});

export const getComplaintById = catchAsync(async (req: Request, res: Response) => {
  const result = await studentService.getComplaintById(req.user!.id, req.params.id);
  res.status(200).json(new ApiResponse("Complaint detail fetched successfully", result));
});

export const getActiveNotices = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const filter: any = {};
  if (req.query.category) {
    filter.category = req.query.category;
  }
  const { data, total } = await studentService.getActiveNotices(filter, page, limit, skip);
  const meta = getPaginationMeta(total, page, limit);
  res.status(200).json(new ApiResponse("Notices fetched successfully", data, meta));
});

export const getNoticeById = catchAsync(async (req: Request, res: Response) => {
  const result = await studentService.getNoticeById(req.params.id);
  res.status(200).json(new ApiResponse("Notice detail fetched successfully", result));
});

export const getPayments = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const { data, total } = await studentService.getPayments(req.user!.id, page, limit, skip);
  const meta = getPaginationMeta(total, page, limit);
  res.status(200).json(new ApiResponse("Payments fetched successfully", data, meta));
});

export const makePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await studentService.makePayment(req.user!.id, req.params.id);
  res.status(200).json(new ApiResponse("Payment marked as paid successfully", result));
});

export const deleteComplaint = catchAsync(async (req: Request, res: Response) => {
  const result = await studentService.deleteComplaint(req.user!.id, req.params.id);
  res.status(200).json(new ApiResponse("Complaint deleted successfully", result));
});

export default {
  getProfile,
  updateProfile,
  getCurrentRoom,
  getBookings,
  createBookingRequest,
  cancelBooking,
  getComplaints,
  createComplaint,
  getComplaintById,
  deleteComplaint,
  getActiveNotices,
  getNoticeById,
  getPayments,
  makePayment,
};
