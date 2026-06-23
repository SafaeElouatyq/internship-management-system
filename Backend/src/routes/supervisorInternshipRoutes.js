import { Router } from "express";
import {
  getSupervisorInternships,
  getSupervisorInternship,
} from "../controllers/supervisorInternshipController.js";
import {
  validateSubject,
  getInternshipSubjectValidations,
} from "../controllers/subjectValidationController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = Router();

router.get(
  "/internships",
  authMiddleware,
  roleMiddleware("SUPERVISOR"),
  getSupervisorInternships,
);
router.get(
  "/internships/:id",
  authMiddleware,
  roleMiddleware("SUPERVISOR"),
  getSupervisorInternship,
);
router.post(
  "/internships/:id/subject-validation",
  authMiddleware,
  roleMiddleware("SUPERVISOR"),
  validateSubject,
);
router.get(
  "/internships/:id/subject-validations",
  authMiddleware,
  roleMiddleware("SUPERVISOR"),
  getInternshipSubjectValidations,
);

export default router;
