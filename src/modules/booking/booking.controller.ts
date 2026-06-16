import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ApiResponse } from "../../utils/ApiResponse";
import bookingService from "./booking.service";
import { getPaginationParams, getPaginationMeta } from "../../utils/pagination";

export const getBookings = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const filter = {
    status: req.query.status,
    search: req.query.search,
  };
  const { data, total } = await bookingService.getBookings(filter, page, limit, skip);
  const meta = getPaginationMeta(total, page, limit);
  res.status(200).json(new ApiResponse("Bookings fetched successfully", data, meta));
});

export const approveBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingService.approveBooking(req.params.id, req.user!.id);
  res.status(200).json(new ApiResponse("Booking approved successfully", result));
});

export const rejectBooking = catchAsync(async (req: Request, res: Response) => {
  const { reason } = req.body;
  const result = await bookingService.rejectBooking(req.params.id, reason, req.user!.id);
  res.status(200).json(new ApiResponse("Booking rejected successfully", result));
});

export default {
  getBookings,
  approveBooking,
  rejectBooking,
};
