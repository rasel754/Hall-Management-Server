"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const roomSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
    versionKey: false,
});
exports.Room = mongoose_1.default.model("Room", roomSchema);
exports.default = exports.Room;
