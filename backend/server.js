import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import adminRoutes from "./routes/admin.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);

app.use("/api/employees", employeeRoutes);


app.get("/", (req, res) => {
  res.send("VyomVision HRMS Backend is running 🚀");
});


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
