import { Router } from "express";
import {
  createReport,
  getMyReports,
  getSupervisorReports,
} from "../controllers/reportController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = Router();

router.post("/", authMiddleware, roleMiddleware("STUDENT"), createReport);
router.get(
  "/my-reports",
  authMiddleware,
  roleMiddleware("STUDENT"),
  getMyReports,
);
router.get(
  "/supervisor",
  authMiddleware,
  roleMiddleware("SUPERVISOR"),
  getSupervisorReports,
);

export default router;
