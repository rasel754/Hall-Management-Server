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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const emergencyContactSchema = new mongoose_1.Schema({
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    relation: { type: String, default: "" },
}, { _id: false });
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [2, "Name must be at least 2 characters"],
        maxlength: [50, "Name must be less than 50 characters"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"],
        select: false,
    },
    role: {
        type: String,
        enum: ["student", "admin"],
        default: "student",
    },
    studentId: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
    },
    department: { type: String, trim: true },
    year: {
        type: Number,
        min: [1, "Year must be at least 1"],
        max: [4, "Year must be at most 4"],
    },
    phone: { type: String, trim: true },
    avatar: { type: String, default: "" },
    emergencyContact: {
        type: emergencyContactSchema,
        default: undefined,
    },
    isBlocked: { type: Boolean, default: false },
    blockReason: { type: String, default: "" },
}, {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Virtual for blocked status, matching the client's expected field name ('blocked' instead of 'isBlocked')
userSchema.virtual("blocked").get(function () {
    return this.isBlocked;
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    try {
        if (!this.password) {
            return next(new Error("Password is required"));
        }
        const salt = await bcryptjs_1.default.genSalt(12);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
userSchema.methods.comparePassword = async function (password) {
    if (!this.password)
        return false;
    return bcryptjs_1.default.compare(password, this.password);
};
exports.User = mongoose_1.default.model("User", userSchema);
exports.default = exports.User;
