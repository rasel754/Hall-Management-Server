"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoomStatus = exports.deleteRoom = exports.updateRoom = exports.getRoomById = exports.createRoom = exports.getRooms = void 0;
const room_model_1 = require("./room.model");
const booking_model_1 = require("../booking/booking.model");
const ApiError_1 = require("../../utils/ApiError");
const mongoose_1 = __importDefault(require("mongoose"));
const getRooms = async (filter, page, limit, skip) => {
    const query = {};
    if (filter.type)
        query.type = filter.type;
    if (filter.floor !== undefined && filter.floor !== "")
        query.floor = Number(filter.floor);
    if (filter.status === "available") {
        query.status = { $nin: ["full", "maintenance"] };
    }
    else if (filter.status) {
        query.status = filter.status;
    }
    const total = await room_model_1.Room.countDocuments(query);
    const data = await room_model_1.Room.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    return { data, total };
};
exports.getRooms = getRooms;
const createRoom = async (data) => {
    const existing = await room_model_1.Room.findOne({ roomNumber: data.roomNumber });
    if (existing) {
        throw new ApiError_1.ApiError(409, "Room number already exists");
    }
    const room = await room_model_1.Room.create(data);
    return room;
};
exports.createRoom = createRoom;
const getRoomById = async (roomId) => {
    if (!mongoose_1.default.isValidObjectId(roomId)) {
        throw new ApiError_1.ApiError(400, "Invalid Room ID");
    }
    const room = await room_model_1.Room.findById(roomId);
    if (!room) {
        throw new ApiError_1.ApiError(404, "Room not found");
    }
    const bookings = await booking_model_1.Booking.find({
        room: roomId,
        status: { $in: ["approved", "active"] },
    }).populate("student", "name email studentId avatar department year phone");
    const occupants = bookings.map((b) => b.student);
    return {
        ...room.toObject(),
        occupants,
    };
};
exports.getRoomById = getRoomById;
const updateRoom = async (roomId, data) => {
    if (!mongoose_1.default.isValidObjectId(roomId)) {
        throw new ApiError_1.ApiError(400, "Invalid Room ID");
    }
    if (data.roomNumber) {
        const existing = await room_model_1.Room.findOne({ roomNumber: data.roomNumber, _id: { $ne: roomId } });
        if (existing) {
            throw new ApiError_1.ApiError(409, "Room number already exists");
        }
    }
    const room = await room_model_1.Room.findByIdAndUpdate(roomId, { $set: data }, { new: true });
    if (!room) {
        throw new ApiError_1.ApiError(404, "Room not found");
    }
    return room;
};
exports.updateRoom = updateRoom;
const deleteRoom = async (roomId) => {
    if (!mongoose_1.default.isValidObjectId(roomId)) {
        throw new ApiError_1.ApiError(400, "Invalid Room ID");
    }
    const room = await room_model_1.Room.findById(roomId);
    if (!room) {
        throw new ApiError_1.ApiError(404, "Room not found");
    }
    if (room.currentOccupancy > 0) {
        throw new ApiError_1.ApiError(400, "Cannot delete room as it is currently occupied");
    }
    await room_model_1.Room.findByIdAndDelete(roomId);
    return room;
};
exports.deleteRoom = deleteRoom;
const updateRoomStatus = async (roomId, status) => {
    if (!mongoose_1.default.isValidObjectId(roomId)) {
        throw new ApiError_1.ApiError(400, "Invalid Room ID");
    }
    const room = await room_model_1.Room.findById(roomId);
    if (!room) {
        throw new ApiError_1.ApiError(404, "Room not found");
    }
    room.status = status;
    await room.save();
    return room;
};
exports.updateRoomStatus = updateRoomStatus;
exports.default = {
    getRooms: exports.getRooms,
    createRoom: exports.createRoom,
    getRoomById: exports.getRoomById,
    updateRoom: exports.updateRoom,
    deleteRoom: exports.deleteRoom,
    updateRoomStatus: exports.updateRoomStatus,
};
