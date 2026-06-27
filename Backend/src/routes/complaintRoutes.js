import { Router } from "express";
import {
  addComplaint,
  editComplaint,
  getComplaint,
  getComplaints,
  listComplaints,
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
router.get(
  "/",
  authMiddleware,
  roleMiddleware("INTERNSHIP_MANAGER"),
  listComplaints,
);
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("INTERNSHIP_MANAGER"),
  getComplaint,
);
router.post(
  "/",
  authMiddleware,
  roleMiddleware("STUDENT"),
  addComplaint,
);
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("INTERNSHIP_MANAGER"),
  editComplaint,
);

export default router;
