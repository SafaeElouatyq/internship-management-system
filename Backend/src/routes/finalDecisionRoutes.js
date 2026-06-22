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
  roleMiddleware("DEPARTMENT_HEAD"),
  getDecisions,
);
router.post(
  "/",
  authMiddleware,
  roleMiddleware("DEPARTMENT_HEAD"),
  addDecision,
);

export default router;
