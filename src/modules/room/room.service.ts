import { Room } from "./room.model";
import { Booking } from "../booking/booking.model";
import { ApiError } from "../../utils/ApiError";
import mongoose from "mongoose";

export const getRooms = async (filter: any, page: number, limit: number, skip: number) => {
  const query: any = {};

  if (filter.type) query.type = filter.type;
  if (filter.floor !== undefined && filter.floor !== "") query.floor = Number(filter.floor);

  if (filter.status === "available") {
    query.status = { $nin: ["full", "maintenance"] };
  } else if (filter.status) {
    query.status = filter.status;
  }

  const total = await Room.countDocuments(query);
  const data = await Room.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
  return { data, total };
};

export const createRoom = async (data: any) => {
  const existing = await Room.findOne({ roomNumber: data.roomNumber });
  if (existing) {
    throw new ApiError(409, "Room number already exists");
  }
  const room = await Room.create(data);
  return room;
};

export const getRoomById = async (roomId: string) => {
  if (!mongoose.isValidObjectId(roomId)) {
    throw new ApiError(400, "Invalid Room ID");
  }

  const room = await Room.findById(roomId);
  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  const bookings = await Booking.find({
    room: roomId,
    status: { $in: ["approved", "active"] },
  }).populate("student", "name email studentId avatar department year phone");

  const occupants = bookings.map((b) => b.student);

  return {
    ...room.toObject(),
    occupants,
  };
};

export const updateRoom = async (roomId: string, data: any) => {
  if (!mongoose.isValidObjectId(roomId)) {
    throw new ApiError(400, "Invalid Room ID");
  }

  if (data.roomNumber) {
    const existing = await Room.findOne({ roomNumber: data.roomNumber, _id: { $ne: roomId } });
    if (existing) {
      throw new ApiError(409, "Room number already exists");
    }
  }

  const room = await Room.findByIdAndUpdate(roomId, { $set: data }, { new: true });
  if (!room) {
    throw new ApiError(404, "Room not found");
  }
  return room;
};

export const deleteRoom = async (roomId: string) => {
  if (!mongoose.isValidObjectId(roomId)) {
    throw new ApiError(400, "Invalid Room ID");
  }

  const room = await Room.findById(roomId);
  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  if (room.currentOccupancy > 0) {
    throw new ApiError(400, "Cannot delete room as it is currently occupied");
  }

  await Room.findByIdAndDelete(roomId);
  return room;
};

export const updateRoomStatus = async (roomId: string, status: string) => {
  if (!mongoose.isValidObjectId(roomId)) {
    throw new ApiError(400, "Invalid Room ID");
  }

  const room = await Room.findById(roomId);
  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  room.status = status as any;
  await room.save();
  return room;
};

export default {
  getRooms,
  createRoom,
  getRoomById,
  updateRoom,
  deleteRoom,
  updateRoomStatus,
};
