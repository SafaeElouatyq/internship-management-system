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
import pfeDocumentRoutes from "./routes/pfeDocumentRoutes.js";
import finalDecisionRoutes from "./routes/finalDecisionRoutes.js";
import supervisorInternshipRoutes from "./routes/supervisorInternshipRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
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
app.use("/api/pfe-documents", pfeDocumentRoutes);
app.use("/api/final-decisions", finalDecisionRoutes);
app.use("/api/supervisor", supervisorInternshipRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/complaints", complaintRoutes);

export default app;
