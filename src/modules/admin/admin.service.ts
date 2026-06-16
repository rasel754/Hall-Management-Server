import { User } from "../student/student.model";
import { Room } from "../room/room.model";
import { Booking } from "../booking/booking.model";
import { Complaint } from "../complaint/complaint.model";
import { Payment } from "../payment/payment.model";
import { ApiError } from "../../utils/ApiError";
import mongoose from "mongoose";

export const getDashboardStats = async () => {
  const totalStudents = await User.countDocuments({ role: "student" });
  const occupiedRooms = await Room.countDocuments({ currentOccupancy: { $gt: 0 } });
  const pendingApprovals = await Booking.countDocuments({ status: "pending" });
  const activeComplaints = await Complaint.countDocuments({ status: { $in: ["pending", "in_progress"] } });

  const currentMonth = new Date().toISOString().substring(0, 7);
  const paidPaymentsThisMonth = await Payment.find({ status: "paid", month: currentMonth });
  const monthlyRevenue = paidPaymentsThisMonth.reduce((sum, p) => sum + p.amount, 0);

  const blockedUsers = await User.countDocuments({ role: "student", isBlocked: true });

  const recentBookings = await Booking.find()
    .populate("student", "name email studentId avatar")
    .populate("room")
    .sort({ createdAt: -1 })
    .limit(5);

  const recentComplaints = await Complaint.find()
    .populate("student", "name email studentId avatar")
    .sort({ createdAt: -1 })
    .limit(5);

  const recentActivity = [
    ...recentBookings.map((b) => ({
      type: "booking",
      message: `Booking request for Room ${b.room ? (b.room as any).roomNumber : "N/A"} is ${b.status}`,
      date: b.createdAt,
      student: b.student,
    })),
    ...recentComplaints.map((c) => ({
      type: "complaint",
      message: `New complaint filed: "${c.title}" (${c.status})`,
      date: c.createdAt,
      student: c.student,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  return {
    totalStudents,
    occupiedRooms,
    pendingApprovals,
    activeComplaints,
    monthlyRevenue,
    blockedUsers,
    recentActivity,
  };
};

export const getStudentsList = async (filter: any, page: number, limit: number, skip: number, sortField = "createdAt", sortOrder = "desc") => {
  const query: any = { role: "student" };

  if (filter.search) {
    query.$or = [
      { name: { $regex: filter.search, $options: "i" } },
      { studentId: { $regex: filter.search, $options: "i" } },
      { email: { $regex: filter.search, $options: "i" } },
    ];
  }

  if (filter.department) {
    query.department = filter.department;
  }

  const sort: any = {};
  sort[sortField] = sortOrder === "asc" ? 1 : -1;

  const total = await User.countDocuments(query);
  const data = await User.find(query).sort(sort).skip(skip).limit(limit);

  return { data, total };
};

export const getStudentDetail = async (studentId: string) => {
  if (!mongoose.isValidObjectId(studentId)) {
    throw new ApiError(400, "Invalid Student ID");
  }

  const student = await User.findOne({ _id: studentId, role: "student" });
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  const bookings = await Booking.find({ student: studentId }).populate("room").sort({ createdAt: -1 });
  const complaints = await Complaint.find({ student: studentId }).sort({ createdAt: -1 });
  const payments = await Payment.find({ student: studentId }).sort({ createdAt: -1 });

  return {
    student,
    bookings,
    complaints,
    payments,
  };
};

export const deleteStudentAccount = async (studentId: string) => {
  if (!mongoose.isValidObjectId(studentId)) {
    throw new ApiError(400, "Invalid Student ID");
  }

  const student = await User.findOne({ _id: studentId, role: "student" });
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  const activeBooking = await Booking.findOne({ student: studentId, status: { $in: ["approved", "active"] } });
  if (activeBooking) {
    throw new ApiError(400, "Cannot delete student with active room booking. Please cancel/reject the booking first.");
  }

  await User.findByIdAndDelete(studentId);
  return student;
};

export const blockStudent = async (studentId: string, reason: string) => {
  if (!mongoose.isValidObjectId(studentId)) {
    throw new ApiError(400, "Invalid Student ID");
  }

  const student = await User.findOne({ _id: studentId, role: "student" });
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  student.isBlocked = true;
  student.blockReason = reason;
  await student.save();

  return student;
};

export const unblockStudent = async (studentId: string) => {
  if (!mongoose.isValidObjectId(studentId)) {
    throw new ApiError(400, "Invalid Student ID");
  }

  const student = await User.findOne({ _id: studentId, role: "student" });
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  student.isBlocked = false;
  student.blockReason = "";
  await student.save();

  return student;
};

export const getAnalytics = async () => {
  const monthlyRevenue = await Payment.aggregate([
    { $match: { status: "paid" } },
    {
      $group: {
        _id: "$month",
        revenue: { $sum: "$amount" },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        month: "$_id",
        revenue: 1,
        _id: 0,
      },
    },
  ]);

  const occupancyByFloor = await Room.aggregate([
    {
      $group: {
        _id: "$floor",
        occupied: { $sum: "$currentOccupancy" },
        capacity: { $sum: "$capacity" },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        floor: "$_id",
        occupied: 1,
        capacity: 1,
        _id: 0,
      },
    },
  ]);

  const complaintsByCategory = await Complaint.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        category: "$_id",
        count: 1,
        _id: 0,
      },
    },
  ]);

  const studentIntakeBySemester = await User.aggregate([
    { $match: { role: "student" } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        semester: "$_id",
        count: 1,
        _id: 0,
      },
    },
  ]);

  const rooms = await Room.find();
  const totalOccupied = rooms.reduce((sum, r) => sum + r.currentOccupancy, 0);
  const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);
  const occupancyRate = totalCapacity > 0 ? Number(((totalOccupied / totalCapacity) * 100).toFixed(2)) : 0;

  return {
    monthlyRevenue,
    occupancyByFloor,
    complaintsByCategory,
    studentIntakeBySemester,
    occupancyRate,
  };
};

export default {
  getDashboardStats,
  getStudentsList,
  getStudentDetail,
  deleteStudentAccount,
  blockStudent,
  unblockStudent,
  getAnalytics,
};
