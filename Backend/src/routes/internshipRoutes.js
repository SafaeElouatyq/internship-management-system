import { Router } from "express";
import {
  getInternships,
  getInternship,
  createInternship,
  editInternship,
  removeInternship,
  verifyAdministrativeFile,
  validateInternship,
  rejectInternship,
  assignInternshipSupervisor,
} from "../controllers/internshipController.js";
import {
  listInternshipDocuments,
  uploadDocument,
} from "../controllers/internshipDocumentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { uploadDocument as uploadInternshipFile } from "../config/upload.js";

const router = Router();

const handleUpload = (req, res, next) => {
  uploadInternshipFile.single("file")(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    next();
  });
};

router.get("/", authMiddleware, roleMiddleware("STUDENT", "INTERNSHIP_MANAGER"), getInternships);
router.patch(
  "/:id/administrative",
  authMiddleware,
  roleMiddleware("INTERNSHIP_MANAGER"),
  verifyAdministrativeFile,
);
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
router.patch(
  "/:id/assign-supervisor",
  authMiddleware,
  roleMiddleware("DEPARTMENT_HEAD"),
  assignInternshipSupervisor,
);
router.get(
  "/:id/documents",
  authMiddleware,
  roleMiddleware(
    "STUDENT",
    "SUPERVISOR",
    "INTERNSHIP_MANAGER",
    "ADMIN",
    "DEPARTMENT_HEAD",
  ),
  listInternshipDocuments,
);
router.post(
  "/:id/documents",
  authMiddleware,
  roleMiddleware("STUDENT"),
  handleUpload,
  uploadDocument,
);
router.get("/:id", authMiddleware, roleMiddleware("STUDENT", "INTERNSHIP_MANAGER"), getInternship);
router.post("/", authMiddleware, roleMiddleware("STUDENT"), createInternship);
router.put("/:id", authMiddleware, roleMiddleware("STUDENT"), editInternship);
router.delete("/:id", authMiddleware, roleMiddleware("STUDENT"), removeInternship);

export default router;
