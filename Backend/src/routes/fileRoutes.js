import { Router } from "express";
import { downloadFile } from "../controllers/fileController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get(
  "/download/:filename",
  authMiddleware,
  downloadFile,
);

export default router;
