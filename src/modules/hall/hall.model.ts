import mongoose, { Schema, Document } from "mongoose";

export interface IHallDocument extends Document {
  name: string;
  address: string;
  description?: string;
  totalRooms: number;
  availableRooms: number;
  amenities: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const hallSchema = new Schema<IHallDocument>(
  {
    name: {
      type: String,
      required: [true, "Hall name is required"],
      trim: true,
      unique: true,
    },
    address: {
      type: String,
      required: [true, "Hall address is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    totalRooms: {
      type: Number,
      required: [true, "Total rooms count is required"],
      min: [0, "Total rooms cannot be negative"],
    },
    availableRooms: {
      type: Number,
      required: [true, "Available rooms count is required"],
      min: [0, "Available rooms cannot be negative"],
    },
    amenities: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Hall = mongoose.model<IHallDocument>("Hall", hallSchema);
export default Hall;
