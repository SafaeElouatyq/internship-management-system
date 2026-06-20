import { Router } from "express";
import { getRoles } from "../controllers/roleController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, getRoles);

export default router;