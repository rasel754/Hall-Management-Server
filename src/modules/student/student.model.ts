import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUserDocument } from "./student.types";

const emergencyContactSchema = new Schema(
  {
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    relation: { type: String, default: "" },
  },
  { _id: false }
);

const userSchema = new Schema<IUserDocument>(
  {
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
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for blocked status, matching the client's expected field name ('blocked' instead of 'isBlocked')
userSchema.virtual("blocked").get(function (this: any) {
  return this.isBlocked;
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    if (!this.password) {
      return next(new Error("Password is required"));
    }
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUserDocument>("User", userSchema);
export default User;
