import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date, 
      required: true,
    },
    checkIn: {
      type: Date,
    },
    checkOut: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Half Day"],
      default: "Present",
    },
  },
  { timestamps: true }
);

// One attendance per employee per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
