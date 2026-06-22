import { Router } from "express";
import { getRoles } from "../controllers/roleController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = Router();

router.get("/", authMiddleware, roleMiddleware("ADMIN"), getRoles);

export default router;