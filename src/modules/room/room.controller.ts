import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ApiResponse } from "../../utils/ApiResponse";
import roomService from "./room.service";
import { getPaginationParams, getPaginationMeta } from "../../utils/pagination";

export const getRooms = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const filter = {
    type: req.query.type,
    floor: req.query.floor,
    status: req.query.status,
  };
  const { data, total } = await roomService.getRooms(filter, page, limit, skip);
  const meta = getPaginationMeta(total, page, limit);
  res.status(200).json(new ApiResponse("Rooms list fetched successfully", data, meta));
});

export const createRoom = catchAsync(async (req: Request, res: Response) => {
  const result = await roomService.createRoom(req.body);
  res.status(201).json(new ApiResponse("Room created successfully", result));
});

export const getRoomById = catchAsync(async (req: Request, res: Response) => {
  const result = await roomService.getRoomById(req.params.id);
  res.status(200).json(new ApiResponse("Room details fetched successfully", result));
});

export const updateRoom = catchAsync(async (req: Request, res: Response) => {
  const result = await roomService.updateRoom(req.params.id, req.body);
  res.status(200).json(new ApiResponse("Room updated successfully", result));
});

export const deleteRoom = catchAsync(async (req: Request, res: Response) => {
  const result = await roomService.deleteRoom(req.params.id);
  res.status(200).json(new ApiResponse("Room deleted successfully", result));
});

export const updateRoomStatus = catchAsync(async (req: Request, res: Response) => {
  const { status } = req.body;
  const result = await roomService.updateRoomStatus(req.params.id, status);
  res.status(200).json(new ApiResponse("Room status updated successfully", result));
});

export default {
  getRooms,
  createRoom,
  getRoomById,
  updateRoom,
  deleteRoom,
  updateRoomStatus,
};
