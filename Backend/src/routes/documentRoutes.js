import { Router } from "express";
import {
  createDocument,
  getDocuments,
  deleteDocument,
} from "../controllers/documentController.js";
import { uploadDocument } from "../config/upload.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("STUDENT"),
  (req, res, next) => {
    uploadDocument.single("file")(req, res, (error) => {
      if (error) {
        return res.status(400).json({
          message: error.message,
        });
      }

      next();
    });
  },
  createDocument,
);
router.get(
  "/",
  authMiddleware,
  roleMiddleware("STUDENT", "INTERNSHIP_MANAGER"),
  getDocuments,
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("STUDENT"),
  deleteDocument,
);

export default router;
