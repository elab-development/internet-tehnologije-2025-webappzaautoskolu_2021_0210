import { Router } from 'express';
import { createTestResult, getTestResults } from '../controllers/testResultController';
import { protect } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = Router();

router.post('/', protect, authorizeRoles('admin', 'instructor'), createTestResult);
router.get('/', protect, getTestResults);

export default router;
