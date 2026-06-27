import { Router } from "express";
import {
  addDecision,
  getDecisions,
} from "../controllers/finalDecisionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware(
    "SUPERVISOR",
    "DEPARTMENT_HEAD",
    "INTERNSHIP_MANAGER",
    "STUDENT",
  ),
  getDecisions,
);
router.post(
  "/",
  authMiddleware,
  roleMiddleware("SUPERVISOR"),
  addDecision,
);

export default router;
