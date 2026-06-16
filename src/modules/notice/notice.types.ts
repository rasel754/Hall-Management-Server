import { Document, Types } from "mongoose";

export interface INotice {
  _id: Types.ObjectId;
  title: string;
  content: string;
  category: "general" | "urgent" | "academic" | "maintenance";
  publishedBy: Types.ObjectId;
  isActive: boolean;
  publishDate: Date;
  expiryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type INoticeDocument = INotice & Document;
