import { Router } from 'express';
import {
  createTest,
  getTests,
  getTestById,
  updateTest,
  deleteTest,
} from '../controllers/testController';

import { protect } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = Router();

router.post('/', protect, authorizeRoles('admin'), createTest);
router.get('/', protect, getTests);
router.get('/:id', protect, getTestById);
router.put('/:id', protect, authorizeRoles('admin'), updateTest);
router.delete('/:id', protect, authorizeRoles('admin'), deleteTest);

export default router;
