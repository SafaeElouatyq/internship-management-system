import {Router} from "express";
import { getUsers } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = Router();

router.get("/", authMiddleware, roleMiddleware("ADMIN"), getUsers);

export default router;