import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ApiResponse } from "../../utils/ApiResponse";
import { ApiError } from "../../utils/ApiError";
import { Hall } from "./hall.model";

export const getAllHalls = catchAsync(async (req: Request, res: Response) => {
  const halls = await Hall.find().sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse("Halls fetched successfully", halls));
});

export const createHall = catchAsync(async (req: Request, res: Response) => {
  const hall = await Hall.create(req.body);
  res.status(201).json(new ApiResponse("Hall created successfully", hall));
});

export const updateHall = catchAsync(async (req: Request, res: Response) => {
  const hall = await Hall.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
  if (!hall) {
    throw new ApiError(404, "Hall not found");
  }
  res.status(200).json(new ApiResponse("Hall updated successfully", hall));
});

export const deleteHall = catchAsync(async (req: Request, res: Response) => {
  const hall = await Hall.findByIdAndDelete(req.params.id);
  if (!hall) {
    throw new ApiError(404, "Hall not found");
  }
  res.status(200).json(new ApiResponse("Hall deleted successfully", hall));
});

export default {
  getAllHalls,
  createHall,
  updateHall,
  deleteHall,
};
