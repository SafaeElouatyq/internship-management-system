import { Router } from "express";
import {
  assignSupervisor,
  getInternships,
  getSupervisors,
} from "../controllers/departmentHeadController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = Router();

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
router.put(
  "/internships/:id/assign-supervisor",
  authMiddleware,
  roleMiddleware("DEPARTMENT_HEAD"),
  assignSupervisor,
);

export default router;
