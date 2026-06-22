import { Router } from "express";
import {
  getInternships,
  getInternship,
  createInternship,
  editInternship,
  removeInternship,
} from "../controllers/internshipController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = Router();

router.get("/", authMiddleware, roleMiddleware("STUDENT"), getInternships);
router.get("/:id", authMiddleware, roleMiddleware("STUDENT"), getInternship);
router.post("/", authMiddleware, roleMiddleware("STUDENT"), createInternship);
router.put("/:id", authMiddleware, roleMiddleware("STUDENT"), editInternship);
router.delete("/:id", authMiddleware, roleMiddleware("STUDENT"), removeInternship);

export default router;
