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
exports.Booking = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bookingSchema = new mongoose_1.Schema({
    student: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Student reference is required"],
    },
    room: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Room",
        required: [true, "Room reference is required"],
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected", "cancelled", "active"],
        default: "pending",
    },
    requestDate: {
        type: Date,
        default: Date.now,
    },
    approvalDate: {
        type: Date,
    },
    approvedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    cancellationReason: {
        type: String,
        default: "",
    },
    cancellationDate: {
        type: Date,
    },
    moveInDate: {
        type: Date,
    },
    moveOutDate: {
        type: Date,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Booking = mongoose_1.default.model("Booking", bookingSchema);
exports.default = exports.Booking;
