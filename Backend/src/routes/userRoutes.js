import { Router } from "express";
import { getUsers, addUser ,editUser , removeUser } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = Router();

router.get("/", authMiddleware, roleMiddleware("ADMIN"), getUsers);

router.post("/", authMiddleware, roleMiddleware("ADMIN"), addUser);
router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), editUser);
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), removeUser);


export default router;