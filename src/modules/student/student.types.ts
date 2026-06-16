import { Document, Types } from "mongoose";

export interface IEmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: "student" | "admin";
  studentId?: string;
  department?: string;
  year?: number;
  phone?: string;
  avatar?: string;
  emergencyContact?: IEmergencyContact;
  isBlocked: boolean;
  blockReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends Omit<IUser, "_id">, Document {
  comparePassword(password: string): Promise<boolean>;
}
