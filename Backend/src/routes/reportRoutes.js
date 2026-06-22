import { Router } from "express";
import {
  createReport,
  updateReport,
  removeReport,
  getMyReport,
  getMyReports,
  getSupervisorReports,
  getSupervisorReport,
  updateReportComment,
} from "../controllers/reportController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { uploadReportAttachments } from "../config/upload.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("STUDENT"),
  uploadReportAttachments.array("attachments", 5),
  createReport,
);
router.get(
  "/my-reports",
  authMiddleware,
  roleMiddleware("STUDENT"),
  getMyReports,
);
router.get(
  "/supervisor",
  authMiddleware,
  roleMiddleware("SUPERVISOR"),
  getSupervisorReports,
);
router.get(
  "/supervisor/:id",
  authMiddleware,
  roleMiddleware("SUPERVISOR"),
  getSupervisorReport,
);
router.patch(
  "/supervisor/:id/comment",
  authMiddleware,
  roleMiddleware("SUPERVISOR"),
  updateReportComment,
);
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("STUDENT"),
  getMyReport,
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("STUDENT"),
  uploadReportAttachments.array("attachments", 5),
  updateReport,
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("STUDENT"),
  removeReport,
);

export default router;
