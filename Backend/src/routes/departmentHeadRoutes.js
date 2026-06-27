import { Router } from "express";
import {
  getDashboard,
  getInternships,
  getSupervisors,
} from "../controllers/departmentHeadController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = Router();

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("DEPARTMENT_HEAD"),
  getDashboard,
);
router.get(
  "/internships",
  authMiddleware,
  roleMiddleware("DEPARTMENT_HEAD"),
  getInternships,
);
router.get(
  "/supervisors",
  authMiddleware,
  roleMiddleware("DEPARTMENT_HEAD"),
  getSupervisors,
);
export default router;
