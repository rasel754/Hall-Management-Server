import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ApiResponse } from "../../utils/ApiResponse";
import noticeService from "./notice.service";
import { getPaginationParams, getPaginationMeta } from "../../utils/pagination";

export const getNotices = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const filter = {
    category: req.query.category,
    isActive: req.query.isActive,
  };
  const { data, total } = await noticeService.getNotices(filter, page, limit, skip);
  const meta = getPaginationMeta(total, page, limit);
  res.status(200).json(new ApiResponse("Notices fetched successfully", data, meta));
});

export const createNotice = catchAsync(async (req: Request, res: Response) => {
  const result = await noticeService.createNotice(req.body, req.user!.id);
  res.status(201).json(new ApiResponse("Notice created successfully", result));
});

export const updateNotice = catchAsync(async (req: Request, res: Response) => {
  const result = await noticeService.updateNotice(req.params.id, req.body);
  res.status(200).json(new ApiResponse("Notice updated successfully", result));
});

export const deleteNotice = catchAsync(async (req: Request, res: Response) => {
  const result = await noticeService.deleteNotice(req.params.id);
  res.status(200).json(new ApiResponse("Notice deleted successfully", result));
});

export const toggleNoticeActive = catchAsync(async (req: Request, res: Response) => {
  const result = await noticeService.toggleNoticeActive(req.params.id);
  res.status(200).json(new ApiResponse("Notice active state toggled successfully", result));
});

export default {
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  toggleNoticeActive,
};
