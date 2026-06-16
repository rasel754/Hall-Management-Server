import mongoose from "mongoose";
import { connectDB } from "./config/db";
import { User } from "./modules/student/student.model";
import { Room } from "./modules/room/room.model";
import { Booking } from "./modules/booking/booking.model";
import { Complaint } from "./modules/complaint/complaint.model";
import { Notice } from "./modules/notice/notice.model";
import { Payment } from "./modules/payment/payment.model";

const seed = async () => {
  try {
    await connectDB();
    console.log("🧹 Clearing database collections...");
    await User.deleteMany({});
    await Room.deleteMany({});
    await Booking.deleteMany({});
    await Complaint.deleteMany({});
    await Notice.deleteMany({});
    await Payment.deleteMany({});
    console.log("✅ Database cleared.");

    console.log("👤 Seeding admin user...");
    const admin = await User.create({
      name: "System Administrator",
      email: "admin@example.com",
      password: "adminpassword123",
      role: "admin",
      phone: "+15550100",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=admin",
      isBlocked: false,
    });
    console.log("✅ Admin seeded.");

    console.log("👥 Seeding student users...");
    const studentsData = [
      { name: "John Doe", email: "john.doe@example.com", password: "password123", studentId: "STU001", department: "Computer Science", year: 3, phone: "+15550101" },
      { name: "Jane Smith", email: "jane.smith@example.com", password: "password123", studentId: "STU002", department: "Electrical Eng", year: 4, phone: "+15550102" },
      { name: "Alice Johnson", email: "alice.johnson@example.com", password: "password123", studentId: "STU003", department: "Mechanical Eng", year: 2, phone: "+15550103" },
      { name: "Bob Brown", email: "bob.brown@example.com", password: "password123", studentId: "STU004", department: "Information Tech", year: 1, phone: "+15550104" },
      { name: "Charlie Davis", email: "charlie.davis@example.com", password: "password123", studentId: "STU005", department: "Civil Eng", year: 3, phone: "+15550105" },
      { name: "Diana Prince", email: "diana.prince@example.com", password: "password123", studentId: "STU006", department: "Software Eng", year: 2, phone: "+15550106" },
      { name: "Evan Wright", email: "evan.wright@example.com", password: "password123", studentId: "STU007", department: "Physics", year: 1, phone: "+15550107" },
      { name: "Fiona Gallagher", email: "fiona.gallagher@example.com", password: "password123", studentId: "STU008", department: "Chemistry", year: 4, phone: "+15550108" },
      { name: "George Costanza", email: "george.costanza@example.com", password: "password123", studentId: "STU009", department: "Mathematics", year: 2, phone: "+15550109" },
      { name: "Hannah Baker", email: "hannah.baker@example.com", password: "password123", studentId: "STU010", department: "Literature", year: 3, phone: "+15550110" },
    ];

    const students: any[] = [];
    for (const s of studentsData) {
      const student = await User.create({
        ...s,
        role: "student",
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${s.name.replace(" ", "")}`,
        emergencyContact: {
          name: "Parent of " + s.name,
          phone: "+15559999",
          relation: "Parent",
        },
      });
      students.push(student);
    }
    console.log("✅ 10 Students seeded.");

    console.log("🚪 Seeding 20 rooms...");
    const rooms: any[] = [];
    const roomTypes = ["single", "double", "triple"] as const;
    const prices = { single: 1500, double: 1000, triple: 800 };
    const capacities = { single: 1, double: 2, triple: 3 };

    for (let floor = 1; floor <= 4; floor++) {
      for (let r = 1; r <= 5; r++) {
        const typeIndex = (floor + r) % 3;
        const type = roomTypes[typeIndex];
        const roomNumber = `${floor}0${r}`;
        const room = await Room.create({
          roomNumber,
          floor,
          type,
          capacity: capacities[type],
          currentOccupancy: 0,
          pricePerMonth: prices[type],
          facilities: ["WiFi", "AC", "Attached Bathroom"].slice(0, (r % 3) + 1),
          images: [`https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=500`],
          status: "available",
        });
        rooms.push(room);
      }
    }
    console.log("✅ 20 Rooms seeded.");

    console.log("📢 Seeding 5 notices...");
    const noticesData = [
      { title: "Annual Hall Fest 2026", content: "We are pleased to announce the annual hall fest scheduled for July 15, 2026. Registrations are open.", category: "general", isActive: true },
      { title: "Power Maintenance Outage", content: "There will be a scheduled power shutdown for maintenance on June 20, 2026 from 9:00 AM to 12:00 PM.", category: "maintenance", isActive: true },
      { title: "Notice: Academic Term End", content: "All students are requested to clear notice requirements before the end of this academic term.", category: "academic", isActive: true },
      { title: "URGENT: Water Supply Interruption", content: "Water supply will be suspended in Wing B on June 18 due to repairs. Please store water beforehand.", category: "urgent", isActive: true },
      { title: "Old Announcement from Spring", content: "This is an expired announcement from last semester regarding textbook library donations.", category: "general", isActive: false, expiryDate: new Date("2026-04-01") },
    ];

    for (const n of noticesData) {
      await Notice.create({
        ...n,
        publishedBy: admin._id,
      });
    }
    console.log("✅ 5 Notices seeded.");

    console.log("📅 Seeding 8 bookings...");
    const monthString = new Date().toISOString().substring(0, 7);

    const bookingSpecs = [
      { studentIndex: 0, roomIndex: 0, status: "approved" },
      { studentIndex: 1, roomIndex: 1, status: "approved" },
      { studentIndex: 2, roomIndex: 2, status: "approved" },
      { studentIndex: 3, roomIndex: 3, status: "pending" },
      { studentIndex: 4, roomIndex: 4, status: "pending" },
      { studentIndex: 5, roomIndex: 5, status: "pending" },
      { studentIndex: 6, roomIndex: 6, status: "rejected", reason: "Room capacity exceeded" },
      { studentIndex: 7, roomIndex: 7, status: "cancelled", reason: "Cancelled by student" },
    ];

    for (const spec of bookingSpecs) {
      const student = students[spec.studentIndex];
      const room = rooms[spec.roomIndex];

      const booking = await Booking.create({
        student: student._id,
        room: room._id,
        status: spec.status,
        moveInDate: spec.status === "approved" ? new Date() : undefined,
        approvalDate: spec.status === "approved" || spec.status === "rejected" ? new Date() : undefined,
        approvedBy: spec.status === "approved" || spec.status === "rejected" ? admin._id : undefined,
        cancellationReason: spec.reason,
        cancellationDate: spec.status === "cancelled" || spec.status === "rejected" ? new Date() : undefined,
      });

      if (spec.status === "approved") {
        room.currentOccupancy += 1;
        if (room.currentOccupancy >= room.capacity) {
          room.status = "full";
        } else {
          room.status = "occupied";
        }
        await room.save();

        await Payment.create({
          student: student._id,
          booking: booking._id,
          amount: room.pricePerMonth,
          month: monthString,
          status: "pending",
        });

        const prevMonth = new Date();
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        const prevMonthString = prevMonth.toISOString().substring(0, 7);
        await Payment.create({
          student: student._id,
          booking: booking._id,
          amount: room.pricePerMonth,
          month: prevMonthString,
          status: "paid",
          paidAt: new Date(prevMonth),
          transactionId: `TXN-SEED${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        });
      }
    }
    console.log("✅ 8 Bookings and related payments seeded.");

    console.log("⚠️ Seeding 6 complaints...");
    const complaintsSpecs = [
      { studentIndex: 0, title: "WiFi router not working", description: "The WiFi router on the 1st floor is down since yesterday. We cannot access the internet.", category: "maintenance", status: "pending" },
      { studentIndex: 1, title: "Loud noise after midnight", description: "Students in adjacent rooms are making loud noises playing video games late at night.", category: "noise", status: "pending" },
      { studentIndex: 2, title: "Bathroom floor is dirty", description: "The cleaning staff has not cleaned the shared bathroom on the 2nd floor for three days.", category: "cleanliness", status: "in_progress" },
      { studentIndex: 3, title: "Broken window latch", description: "The window latch in Room 104 is completely broken, posing a security risk.", category: "security", status: "resolved", resolvedBy: admin._id, adminNote: "Window latch replaced by the maintenance crew." },
      { studentIndex: 4, title: "Clogged shower drain", description: "The shower drain in the wing bathroom is clogged with water accumulation.", category: "maintenance", status: "resolved", resolvedBy: admin._id, adminNote: "Plumber cleared the drainage block." },
      { studentIndex: 0, title: "Water dispenser filter replacement", description: "The water dispenser filter light is red, please replace the filter.", category: "other", status: "in_progress" },
    ];

    for (const c of complaintsSpecs) {
      await Complaint.create({
        student: students[c.studentIndex]._id,
        title: c.title,
        description: c.description,
        category: c.category,
        status: c.status,
        resolvedBy: c.resolvedBy,
        resolvedAt: c.resolvedBy ? new Date() : undefined,
        adminNote: c.adminNote,
      });
    }
    console.log("✅ 6 Complaints seeded.");

    console.log("🌱 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding database failed:", error);
    process.exit(1);
  }
};

seed();
