"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalytics = exports.unblockStudent = exports.blockStudent = exports.deleteStudentAccount = exports.getStudentDetail = exports.getStudentsList = exports.getDashboardStats = void 0;
const student_model_1 = require("../student/student.model");
const room_model_1 = require("../room/room.model");
const booking_model_1 = require("../booking/booking.model");
const complaint_model_1 = require("../complaint/complaint.model");
const payment_model_1 = require("../payment/payment.model");
const ApiError_1 = require("../../utils/ApiError");
const mongoose_1 = __importDefault(require("mongoose"));
const getDashboardStats = async () => {
    const totalStudents = await student_model_1.User.countDocuments({ role: "student" });
    const occupiedRooms = await room_model_1.Room.countDocuments({ currentOccupancy: { $gt: 0 } });
    const pendingApprovals = await booking_model_1.Booking.countDocuments({ status: "pending" });
    const activeComplaints = await complaint_model_1.Complaint.countDocuments({ status: { $in: ["pending", "in_progress"] } });
    const currentMonth = new Date().toISOString().substring(0, 7);
    const paidPaymentsThisMonth = await payment_model_1.Payment.find({ status: "paid", month: currentMonth });
    const monthlyRevenue = paidPaymentsThisMonth.reduce((sum, p) => sum + p.amount, 0);
    const blockedUsers = await student_model_1.User.countDocuments({ role: "student", isBlocked: true });
    const recentBookings = await booking_model_1.Booking.find()
        .populate("student", "name email studentId avatar")
        .populate("room")
        .sort({ createdAt: -1 })
        .limit(5);
    const recentComplaints = await complaint_model_1.Complaint.find()
        .populate("student", "name email studentId avatar")
        .sort({ createdAt: -1 })
        .limit(5);
    const recentActivity = [
        ...recentBookings.map((b) => ({
            type: "booking",
            message: `Booking request for Room ${b.room ? b.room.roomNumber : "N/A"} is ${b.status}`,
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
exports.getDashboardStats = getDashboardStats;
const getStudentsList = async (filter, page, limit, skip, sortField = "createdAt", sortOrder = "desc") => {
    const query = { role: "student" };
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
    const sort = {};
    sort[sortField] = sortOrder === "asc" ? 1 : -1;
    const total = await student_model_1.User.countDocuments(query);
    const data = await student_model_1.User.find(query).sort(sort).skip(skip).limit(limit);
    return { data, total };
};
exports.getStudentsList = getStudentsList;
const getStudentDetail = async (studentId) => {
    if (!mongoose_1.default.isValidObjectId(studentId)) {
        throw new ApiError_1.ApiError(400, "Invalid Student ID");
    }
    const student = await student_model_1.User.findOne({ _id: studentId, role: "student" });
    if (!student) {
        throw new ApiError_1.ApiError(404, "Student not found");
    }
    const bookings = await booking_model_1.Booking.find({ student: studentId }).populate("room").sort({ createdAt: -1 });
    const complaints = await complaint_model_1.Complaint.find({ student: studentId }).sort({ createdAt: -1 });
    const payments = await payment_model_1.Payment.find({ student: studentId }).sort({ createdAt: -1 });
    return {
        student,
        bookings,
        complaints,
        payments,
    };
};
exports.getStudentDetail = getStudentDetail;
const deleteStudentAccount = async (studentId) => {
    if (!mongoose_1.default.isValidObjectId(studentId)) {
        throw new ApiError_1.ApiError(400, "Invalid Student ID");
    }
    const student = await student_model_1.User.findOne({ _id: studentId, role: "student" });
    if (!student) {
        throw new ApiError_1.ApiError(404, "Student not found");
    }
    const activeBooking = await booking_model_1.Booking.findOne({ student: studentId, status: { $in: ["approved", "active"] } });
    if (activeBooking) {
        throw new ApiError_1.ApiError(400, "Cannot delete student with active room booking. Please cancel/reject the booking first.");
    }
    await student_model_1.User.findByIdAndDelete(studentId);
    return student;
};
exports.deleteStudentAccount = deleteStudentAccount;
const blockStudent = async (studentId, reason) => {
    if (!mongoose_1.default.isValidObjectId(studentId)) {
        throw new ApiError_1.ApiError(400, "Invalid Student ID");
    }
    const student = await student_model_1.User.findOne({ _id: studentId, role: "student" });
    if (!student) {
        throw new ApiError_1.ApiError(404, "Student not found");
    }
    student.isBlocked = true;
    student.blockReason = reason;
    await student.save();
    return student;
};
exports.blockStudent = blockStudent;
const unblockStudent = async (studentId) => {
    if (!mongoose_1.default.isValidObjectId(studentId)) {
        throw new ApiError_1.ApiError(400, "Invalid Student ID");
    }
    const student = await student_model_1.User.findOne({ _id: studentId, role: "student" });
    if (!student) {
        throw new ApiError_1.ApiError(404, "Student not found");
    }
    student.isBlocked = false;
    student.blockReason = "";
    await student.save();
    return student;
};
exports.unblockStudent = unblockStudent;
const getAnalytics = async () => {
    const monthlyRevenue = await payment_model_1.Payment.aggregate([
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
    const occupancyByFloor = await room_model_1.Room.aggregate([
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
    const complaintsByCategory = await complaint_model_1.Complaint.aggregate([
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
    const studentIntakeBySemester = await student_model_1.User.aggregate([
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
    const rooms = await room_model_1.Room.find();
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
exports.getAnalytics = getAnalytics;
exports.default = {
    getDashboardStats: exports.getDashboardStats,
    getStudentsList: exports.getStudentsList,
    getStudentDetail: exports.getStudentDetail,
    deleteStudentAccount: exports.deleteStudentAccount,
    blockStudent: exports.blockStudent,
    unblockStudent: exports.unblockStudent,
    getAnalytics: exports.getAnalytics,
};
