import { Router } from 'express';
import {
  createInstructor,
  getInstructors,
  getInstructorById,
  updateInstructor,
  deleteInstructor,
} from '../controllers/instructorController';

import { protect } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = Router();

router.post('/', protect, authorizeRoles('admin'), createInstructor);
router.get('/', protect, getInstructors);
router.get('/:id', protect, getInstructorById);
router.put('/:id', protect, authorizeRoles('admin'), updateInstructor);
router.delete('/:id', protect, authorizeRoles('admin'), deleteInstructor);

export default router;
