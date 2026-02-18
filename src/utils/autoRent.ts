import { User } from "../models/user.model"
import { Payment } from "../models/payment.model"

export const generateMonthlyRent = async () => {
  try {
    const students = await User.find({ role: "student", blocked: false })
    const currentDate = new Date()
    const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" })

    for (const student of students) {
      const existingPayment = await Payment.findOne({
        studentId: student._id,
        month: monthName,
      })

      if (!existingPayment) {
        await Payment.create({
          studentId: student._id,
          amount: 1100,
          month: monthName,
          status: "Pending",
        })
      }
    }

    console.log(`[Auto Rent] Generated rent for ${students.length} students`)
  } catch (error) {
    console.error("[Auto Rent Error]", error)
  }
}
