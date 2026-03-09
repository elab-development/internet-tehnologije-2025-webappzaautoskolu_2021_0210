import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";
import {
  cleanupInvalidTestsAdmin,
  createTestAdmin,
  deleteTestAdmin,
  getAllTestsAdmin,
  getAvailableTests,
  getMyTestResults,
  getTestById,
  submitTest,
  updateTestStatusAdmin,
} from "../controllers/testController";

const router = Router();

router.get("/admin/all", protect, authorizeRoles("admin"), getAllTestsAdmin);
router.post("/admin", protect, authorizeRoles("admin"), createTestAdmin);
router.put("/admin/:id/status", protect, authorizeRoles("admin"), updateTestStatusAdmin);
router.delete("/admin/:id", protect, authorizeRoles("admin"), deleteTestAdmin);
router.delete("/admin/cleanup/invalid", protect, authorizeRoles("admin"), cleanupInvalidTestsAdmin);

router.get("/", protect, authorizeRoles("candidate"), getAvailableTests);
router.get("/results/me", protect, authorizeRoles("candidate"), getMyTestResults);
router.get("/:id", protect, authorizeRoles("candidate"), getTestById);
router.post("/submit", protect, authorizeRoles("candidate"), submitTest);

export default router;
