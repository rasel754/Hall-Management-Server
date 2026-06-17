import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ApiResponse } from "../../utils/ApiResponse";
import { ApiError } from "../../utils/ApiError";
import complaintService from "./complaint.service";
import { getPaginationParams, getPaginationMeta } from "../../utils/pagination";

export const getComplaints = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const filter = {
    status: req.query.status,
    category: req.query.category,
  };
  const { data, total } = await complaintService.getComplaints(filter, page, limit, skip);
  const meta = getPaginationMeta(total, page, limit);
  res.status(200).json(new ApiResponse("Complaints fetched successfully", data, meta));
});

export const updateComplaintStatus = catchAsync(async (req: Request, res: Response) => {
  const { status, adminNote } = req.body || {};
  if (!status) {
    throw new ApiError(400, "Status is required");
  }
  const result = await complaintService.updateComplaintStatus(req.params.id, status, adminNote, req.user!.id);
  res.status(200).json(new ApiResponse("Complaint status updated successfully", result));
});

export default {
  getComplaints,
  updateComplaintStatus,
};
