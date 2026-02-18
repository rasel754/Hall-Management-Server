import mongoose, { Schema, type Document } from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: "student" | "admin"
  blocked: boolean
  roomId?: mongoose.Types.ObjectId
  createdAt: Date
  comparePassword(password: string): Promise<boolean>
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    blocked: { type: Boolean, default: false },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password)
}

export const User = mongoose.model<IUser>("User", userSchema)
