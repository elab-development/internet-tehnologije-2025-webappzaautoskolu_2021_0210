import { Router } from 'express';
import {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
} from '../controllers/candidateController';

import { protect } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = Router();

router.post('/', protect, authorizeRoles('admin', 'instructor'), createCandidate);
router.get('/', protect, getCandidates);
router.get('/:id', protect, getCandidateById);
router.put('/:id', protect, authorizeRoles('admin', 'instructor'), updateCandidate);
router.delete('/:id', protect, authorizeRoles('admin'), deleteCandidate);

export default router;
