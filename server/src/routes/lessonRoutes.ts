import { Router } from 'express';
import {
  createLesson,
  getLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
} from '../controllers/lessonController';

import { protect } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = Router();

router.post('/', protect, authorizeRoles('admin', 'instructor'), createLesson);
router.get('/', protect, getLessons);
router.get('/:id', protect, getLessonById);
router.put('/:id', protect, authorizeRoles('admin', 'instructor'), updateLesson);
router.delete('/:id', protect, authorizeRoles('admin'), deleteLesson);

export default router;
