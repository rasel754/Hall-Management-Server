import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ApiResponse } from "../../utils/ApiResponse";
import paymentService from "./payment.service";
import { getPaginationParams, getPaginationMeta } from "../../utils/pagination";

export const getPayments = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const filter = {
    status: req.query.status,
    month: req.query.month,
  };
  const { data, total } = await paymentService.getPayments(filter, page, limit, skip);
  const meta = getPaginationMeta(total, page, limit);
  res.status(200).json(new ApiResponse("Payments fetched successfully", data, meta));
});

export const updatePaymentStatus = catchAsync(async (req: Request, res: Response) => {
  const { status } = req.body;
  const result = await paymentService.updatePaymentStatus(req.params.id, status);
  res.status(200).json(new ApiResponse("Payment status updated successfully", result));
});

export default {
  getPayments,
  updatePaymentStatus,
};
