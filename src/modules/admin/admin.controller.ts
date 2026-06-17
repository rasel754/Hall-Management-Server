import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ApiResponse } from "../../utils/ApiResponse";
import adminService from "./admin.service";
import { getPaginationParams, getPaginationMeta } from "../../utils/pagination";

export const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getDashboardStats();
  res.status(200).json(new ApiResponse("Dashboard stats fetched successfully", result));
});

export const getStudentsList = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const filter = {
    search: req.query.search,
    department: req.query.department,
  };
  const sortField = (req.query.sortBy as string) || "createdAt";
  const sortOrder = (req.query.sortOrder as string) || "desc";

  const { data, total } = await adminService.getStudentsList(filter, page, limit, skip, sortField, sortOrder);
  const meta = getPaginationMeta(total, page, limit);

  res.status(200).json(new ApiResponse("Students list fetched successfully", data, meta));
});

export const getStudentDetail = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getStudentDetail(req.params.id);
  res.status(200).json(new ApiResponse("Student details fetched successfully", result));
});

export const deleteStudentAccount = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.deleteStudentAccount(req.params.id);
  res.status(200).json(new ApiResponse("Student account deleted successfully", result));
});

export const blockStudent = catchAsync(async (req: Request, res: Response) => {
  const { reason } = req.body || {};
  const result = await adminService.blockStudent(req.params.id, reason || "Administrative suspension");
  res.status(200).json(new ApiResponse("Student blocked successfully", result));
});

export const unblockStudent = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.unblockStudent(req.params.id);
  res.status(200).json(new ApiResponse("Student unblocked successfully", result));
});

export const getAnalytics = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAnalytics();
  res.status(200).json(new ApiResponse("Analytics data fetched successfully", result));
});

export default {
  getDashboardStats,
  getStudentsList,
  getStudentDetail,
  deleteStudentAccount,
  blockStudent,
  unblockStudent,
  getAnalytics,
};
