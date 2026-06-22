import { Router } from "express";
import {
  addComplaint,
  getComplaints,
} from "../controllers/complaintController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = Router();

router.get(
  "/my-complaints",
  authMiddleware,
  roleMiddleware("STUDENT"),
  getComplaints,
);
router.post(
  "/",
  authMiddleware,
  roleMiddleware("STUDENT"),
  addComplaint,
);

export default router;
