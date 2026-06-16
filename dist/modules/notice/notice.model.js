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
exports.Notice = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const noticeSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        minlength: [5, "Title must be at least 5 characters"],
        maxlength: [150, "Title must be less than 150 characters"],
        trim: true,
    },
    content: {
        type: String,
        required: [true, "Content is required"],
        minlength: [20, "Content must be at least 20 characters"],
        maxlength: [5000, "Content must be less than 5000 characters"],
        trim: true,
    },
    category: {
        type: String,
        enum: ["general", "urgent", "academic", "maintenance"],
        required: [true, "Category is required"],
    },
    publishedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Publisher reference is required"],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    publishDate: {
        type: Date,
        default: Date.now,
    },
    expiryDate: {
        type: Date,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Notice = mongoose_1.default.model("Notice", noticeSchema);
exports.default = exports.Notice;
