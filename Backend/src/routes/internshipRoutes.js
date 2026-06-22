import { Router } from "express";
import {
  getInternships,
  getInternship,
  createInternship,
  editInternship,
  removeInternship,
  validateInternship,
  rejectInternship,
} from "../controllers/internshipController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = Router();

router.get("/", authMiddleware, roleMiddleware("STUDENT", "INTERNSHIP_MANAGER"), getInternships);
router.patch(
  "/:id/validate",
  authMiddleware,
  roleMiddleware("INTERNSHIP_MANAGER"),
  validateInternship,
);
router.patch(
  "/:id/reject",
  authMiddleware,
  roleMiddleware("INTERNSHIP_MANAGER"),
  rejectInternship,
);
router.get("/:id", authMiddleware, roleMiddleware("STUDENT", "INTERNSHIP_MANAGER"), getInternship);
router.post("/", authMiddleware, roleMiddleware("STUDENT"), createInternship);
router.put("/:id", authMiddleware, roleMiddleware("STUDENT"), editInternship);
router.delete("/:id", authMiddleware, roleMiddleware("STUDENT"), removeInternship);

export default router;
