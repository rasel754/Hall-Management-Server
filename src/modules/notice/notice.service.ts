import { Notice } from "./notice.model";
import { ApiError } from "../../utils/ApiError";
import mongoose from "mongoose";

export const getNotices = async (filter: any, page: number, limit: number, skip: number) => {
  const query: any = {};
  if (filter.category) {
    query.category = filter.category;
  }
  if (filter.isActive !== undefined && filter.isActive !== "") {
    query.isActive = filter.isActive === "true" || filter.isActive === true;
  }

  const total = await Notice.countDocuments(query);
  const data = await Notice.find(query)
    .populate("publishedBy", "name email avatar")
    .sort({ publishDate: -1 })
    .skip(skip)
    .limit(limit);

  return { data, total };
};

export const createNotice = async (data: any, adminId: string) => {
  const notice = await Notice.create({
    ...data,
    publishedBy: new mongoose.Types.ObjectId(adminId),
    publishDate: new Date(),
  });
  return notice;
};

export const updateNotice = async (noticeId: string, data: any) => {
  if (!mongoose.isValidObjectId(noticeId)) {
    throw new ApiError(400, "Invalid Notice ID");
  }

  const notice = await Notice.findByIdAndUpdate(noticeId, { $set: data }, { new: true });
  if (!notice) {
    throw new ApiError(404, "Notice not found");
  }
  return notice;
};

export const deleteNotice = async (noticeId: string) => {
  if (!mongoose.isValidObjectId(noticeId)) {
    throw new ApiError(400, "Invalid Notice ID");
  }

  const notice = await Notice.findByIdAndDelete(noticeId);
  if (!notice) {
    throw new ApiError(404, "Notice not found");
  }
  return notice;
};

export const toggleNoticeActive = async (noticeId: string) => {
  if (!mongoose.isValidObjectId(noticeId)) {
    throw new ApiError(400, "Invalid Notice ID");
  }

  const notice = await Notice.findById(noticeId);
  if (!notice) {
    throw new ApiError(404, "Notice not found");
  }

  notice.isActive = !notice.isActive;
  await notice.save();
  return notice;
};

export default {
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  toggleNoticeActive,
};
