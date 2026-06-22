import express from "express";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import internshipRoutes from "./routes/internshipRoutes.js";
import supervisorRoutes from "./routes/supervisorRoutes.js";
import cors from "cors";


const app = express();
app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/supervisors", supervisorRoutes);



export default app;
