import { Document, Types } from "mongoose";

export interface IRoom {
  _id: Types.ObjectId;
  roomNumber: string;
  floor: number;
  type: "single" | "double" | "triple";
  capacity: number;
  currentOccupancy: number;
  pricePerMonth: number;
  facilities: string[];
  images: string[];
  status: "available" | "occupied" | "full" | "maintenance";
  createdAt: Date;
  updatedAt: Date;
}

export type IRoomDocument = IRoom & Document;
