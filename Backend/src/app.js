import express from "express";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import internshipRoutes from "./routes/internshipRoutes.js";
import supervisorRoutes from "./routes/supervisorRoutes.js";
import departmentHeadRoutes from "./routes/departmentHeadRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));


const app = express();
app.use(cors());

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/supervisors", supervisorRoutes);
app.use("/api/department-head", departmentHeadRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/documents", documentRoutes);



export default app;
