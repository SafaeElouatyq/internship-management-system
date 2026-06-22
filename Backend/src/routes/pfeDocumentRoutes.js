import { Router } from "express";
import {
  createPfeDocument,
  getMyPfeDocumentsList,
  removePfeDocument,
  getSupervisorPfeDocumentsList,
  getSupervisorPfeDocument,
  validateSupervisorPfeDocument,
} from "../controllers/pfeDocumentController.js";
import { uploadPfeDocument } from "../config/upload.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = Router();

const handleUpload = (req, res, next) => {
  uploadPfeDocument.single("file")(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    next();
  });
};

router.post(
  "/",
  authMiddleware,
  roleMiddleware("STUDENT"),
  handleUpload,
  createPfeDocument,
);
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("STUDENT"),
  getMyPfeDocumentsList,
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("STUDENT"),
  removePfeDocument,
);
router.get(
  "/supervisor",
  authMiddleware,
  roleMiddleware("SUPERVISOR"),
  getSupervisorPfeDocumentsList,
);
router.get(
  "/supervisor/:id",
  authMiddleware,
  roleMiddleware("SUPERVISOR"),
  getSupervisorPfeDocument,
);
router.patch(
  "/supervisor/:id/validate",
  authMiddleware,
  roleMiddleware("SUPERVISOR"),
  validateSupervisorPfeDocument,
);

export default router;
