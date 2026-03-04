import { Router } from 'express';
import {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  getMyCandidateProfile,
  getMyCandidate 
} from '../controllers/candidateController';

import { protect } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = Router();

router.post('/', protect, authorizeRoles('admin'), createCandidate);

router.get('/', protect, authorizeRoles('admin', 'instructor'), getCandidates);

router.get('/', protect, authorizeRoles('admin', 'instructor'), getCandidates);
router.get("/me",protect,authorizeRoles("candidate"), getMyCandidateProfile);
router.get("/me", protect, authorizeRoles("candidate"), getMyCandidate);
router.get('/:id', protect, authorizeRoles('admin', 'instructor'), getCandidateById);

router.put('/:id', protect, authorizeRoles('admin', 'instructor'), updateCandidate);

router.delete('/:id', protect, authorizeRoles('admin'), deleteCandidate);

export default router;
