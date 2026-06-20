import { Router } from "express";
import { getDepartments } from "../controllers/departmentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, getDepartments);

export default router;