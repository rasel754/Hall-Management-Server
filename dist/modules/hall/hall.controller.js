"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHall = exports.updateHall = exports.createHall = exports.getAllHalls = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const hall_model_1 = require("./hall.model");
exports.getAllHalls = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const halls = await hall_model_1.Hall.find().sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse_1.ApiResponse("Halls fetched successfully", halls));
});
exports.createHall = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const hall = await hall_model_1.Hall.create(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse("Hall created successfully", hall));
});
exports.updateHall = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const hall = await hall_model_1.Hall.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!hall) {
        throw new ApiError_1.ApiError(404, "Hall not found");
    }
    res.status(200).json(new ApiResponse_1.ApiResponse("Hall updated successfully", hall));
});
exports.deleteHall = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const hall = await hall_model_1.Hall.findByIdAndDelete(req.params.id);
    if (!hall) {
        throw new ApiError_1.ApiError(404, "Hall not found");
    }
    res.status(200).json(new ApiResponse_1.ApiResponse("Hall deleted successfully", hall));
});
exports.default = {
    getAllHalls: exports.getAllHalls,
    createHall: exports.createHall,
    updateHall: exports.updateHall,
    deleteHall: exports.deleteHall,
};
