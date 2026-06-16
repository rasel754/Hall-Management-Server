import { Document, Types } from "mongoose";

export interface IComplaint {
  _id: Types.ObjectId;
  student: Types.ObjectId;
  title: string;
  category: "maintenance" | "noise" | "cleanliness" | "security" | "other";
  description: string;
  image?: string;
  status: "pending" | "in_progress" | "resolved";
  resolvedBy?: Types.ObjectId;
  resolvedAt?: Date;
  adminNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IComplaintDocument = IComplaint & Document;
