import {
  listAllDocuments,
  removeDocument,
} from "../controllers/internshipDocumentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { Router } from "express";

const router = Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("INTERNSHIP_MANAGER", "ADMIN"),
  listAllDocuments,
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("STUDENT"),
  removeDocument,
);

export default router;
