import { Complaint } from "./complaint.model";
import { ApiError } from "../../utils/ApiError";
import mongoose from "mongoose";

export const getComplaints = async (filter: any, page: number, limit: number, skip: number) => {
  const query: any = {};
  if (filter.status) {
    query.status = filter.status;
  }
  if (filter.category) {
    query.category = filter.category;
  }

  const total = await Complaint.countDocuments(query);
  const data = await Complaint.find(query)
    .populate("student", "name email studentId avatar department year phone")
    .populate("resolvedBy", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return { data, total };
};

export const updateComplaintStatus = async (complaintId: string, status: string, adminNote: string | undefined, adminId: string) => {
  if (!mongoose.isValidObjectId(complaintId)) {
    throw new ApiError(400, "Invalid Complaint ID");
  }

  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
    throw new ApiError(404, "Complaint not found");
  }

  complaint.status = status as any;
  if (adminNote !== undefined) {
    complaint.adminNote = adminNote;
  }

  if (status === "resolved") {
    complaint.resolvedBy = new mongoose.Types.ObjectId(adminId);
    complaint.resolvedAt = new Date();
  } else {
    complaint.resolvedBy = undefined;
    complaint.resolvedAt = undefined;
  }

  await complaint.save();
  return complaint;
};

export default {
  getComplaints,
  updateComplaintStatus,
};
