"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoomStatus = exports.deleteRoom = exports.updateRoom = exports.getRoomById = exports.createRoom = exports.getRooms = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const ApiResponse_1 = require("../../utils/ApiResponse");
const room_service_1 = __importDefault(require("./room.service"));
const pagination_1 = require("../../utils/pagination");
exports.getRooms = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page, limit, skip } = (0, pagination_1.getPaginationParams)(req.query);
    const filter = {
        type: req.query.type,
        floor: req.query.floor,
        status: req.query.status,
    };
    const { data, total } = await room_service_1.default.getRooms(filter, page, limit, skip);
    const meta = (0, pagination_1.getPaginationMeta)(total, page, limit);
    res.status(200).json(new ApiResponse_1.ApiResponse("Rooms list fetched successfully", data, meta));
});
exports.createRoom = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await room_service_1.default.createRoom(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse("Room created successfully", result));
});
exports.getRoomById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await room_service_1.default.getRoomById(req.params.id);
    res.status(200).json(new ApiResponse_1.ApiResponse("Room details fetched successfully", result));
});
exports.updateRoom = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await room_service_1.default.updateRoom(req.params.id, req.body);
    res.status(200).json(new ApiResponse_1.ApiResponse("Room updated successfully", result));
});
exports.deleteRoom = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await room_service_1.default.deleteRoom(req.params.id);
    res.status(200).json(new ApiResponse_1.ApiResponse("Room deleted successfully", result));
});
exports.updateRoomStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { status } = req.body;
    const result = await room_service_1.default.updateRoomStatus(req.params.id, status);
    res.status(200).json(new ApiResponse_1.ApiResponse("Room status updated successfully", result));
});
exports.default = {
    getRooms: exports.getRooms,
    createRoom: exports.createRoom,
    getRoomById: exports.getRoomById,
    updateRoom: exports.updateRoom,
    deleteRoom: exports.deleteRoom,
    updateRoomStatus: exports.updateRoomStatus,
};
