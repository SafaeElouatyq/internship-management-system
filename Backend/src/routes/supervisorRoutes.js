import { Router } from "express";
import { getSupervisors } from "../controllers/supervisorController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = Router();

router.get("/", authMiddleware, roleMiddleware("INTERNSHIP_MANAGER"), getSupervisors);

export default router;
