import { Router } from "express";
import {
  scheduleMeeting,
  getMeetingsForStudent,
  getMeetingsForSupervisor,
} from "../controllers/meetingController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = Router();

router.post("/", authMiddleware, roleMiddleware("SUPERVISOR"), scheduleMeeting);
router.get(
  "/student",
  authMiddleware,
  roleMiddleware("STUDENT"),
  getMeetingsForStudent,
);
router.get(
  "/supervisor",
  authMiddleware,
  roleMiddleware("SUPERVISOR"),
  getMeetingsForSupervisor,
);

export default router;
