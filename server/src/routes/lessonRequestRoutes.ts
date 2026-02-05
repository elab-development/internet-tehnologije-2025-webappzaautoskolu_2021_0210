import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";

import {
  createLessonRequest,
  getMyLessonRequests,
  getInstructorLessonRequests,
  approveLessonRequest,
  rejectLessonRequest,
} from "../controllers/lessonRequestController";

const router = Router();

// candidate
router.post("/", protect, authorizeRoles("candidate"), createLessonRequest);
router.get("/my", protect, authorizeRoles("candidate"), getMyLessonRequests);

// instructor
router.get("/instructor", protect, authorizeRoles("instructor"), getInstructorLessonRequests);
router.patch("/:id/approve", protect, authorizeRoles("instructor"), approveLessonRequest);
router.patch("/:id/reject", protect, authorizeRoles("instructor"), rejectLessonRequest);

export default router;
