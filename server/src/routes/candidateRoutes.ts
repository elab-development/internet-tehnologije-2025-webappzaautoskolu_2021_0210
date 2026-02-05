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

//  samo admin kreira kandidata (upravljanje korisnicima)
router.post('/', protect, authorizeRoles('admin'), createCandidate);

//  admin + instructor mogu da vide kandidate
router.get('/', protect, authorizeRoles('admin', 'instructor'), getCandidates);

//  admin + instructor mogu da vide detalje kandidata
router.get('/', protect, authorizeRoles('admin', 'instructor'), getCandidates);
router.get("/me",protect,authorizeRoles("candidate"), getMyCandidateProfile);
router.get("/me", protect, authorizeRoles("candidate"), getMyCandidate);
router.get('/:id', protect, authorizeRoles('admin', 'instructor'), getCandidateById);

// admin + instructor mogu da update-uju (npr. totalLessons/napredak)
router.put('/:id', protect, authorizeRoles('admin', 'instructor'), updateCandidate);

//  samo admin briše
router.delete('/:id', protect, authorizeRoles('admin'), deleteCandidate);

export default router;
