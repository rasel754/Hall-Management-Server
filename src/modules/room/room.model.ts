import mongoose, { Schema } from "mongoose";
import { IRoomDocument } from "./room.types";

const roomSchema = new Schema<IRoomDocument>(
  {
    roomNumber: {
      type: String,
      required: [true, "Room number is required"],
      unique: true,
      trim: true,
    },
    floor: {
      type: Number,
      required: [true, "Floor is required"],
    },
    type: {
      type: String,
      enum: ["single", "double", "triple"],
      required: [true, "Room type is required"],
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
    },
    currentOccupancy: {
      type: Number,
      default: 0,
    },
    pricePerMonth: {
      type: Number,
      required: [true, "Price per month is required"],
    },
    facilities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["available", "occupied", "full", "maintenance"],
      default: "available",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Room = mongoose.model<IRoomDocument>("Room", roomSchema);
export default Room;
