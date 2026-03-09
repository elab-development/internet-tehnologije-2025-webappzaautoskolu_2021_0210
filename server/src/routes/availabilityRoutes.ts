import { Router } from "express";
import {
  addAvailability,
  getInstructorAvailability,
  bookLesson,
  getInstructorSlots
} from "../controllers/availabilityController";

import { protect } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";

const router = Router();

router.post("/", protect, authorizeRoles("instructor"), addAvailability);

router.get("/my-instructor", protect, authorizeRoles("candidate"), getInstructorAvailability);

router.post("/book/:id", protect, authorizeRoles("candidate"), bookLesson);
router.get("/instructor", protect, authorizeRoles("instructor"), getInstructorSlots);

export default router;