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

/**
 * @swagger
 * /api/candidates:
 *   post:
 *     summary: Create new candidate
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: User ID of the candidate
 *                 example: 665f2e4b6b3f1a3c9c9a1234
 *               instructor:
 *                 type: string
 *                 description: Instructor ID
 *                 example: 665f2e4b6b3f1a3c9c9a5678
 *               totalLessons:
 *                 type: number
 *                 example: 0
 *     responses:
 *       201:
 *         description: Candidate created successfully
 *       400:
 *         description: Invalid data
 */
router.post('/', protect, authorizeRoles('admin'), createCandidate);

router.get('/', protect, authorizeRoles('admin', 'instructor'), getCandidates);

router.get('/', protect, authorizeRoles('admin', 'instructor'), getCandidates);
router.get("/me",protect,authorizeRoles("candidate"), getMyCandidateProfile);
router.get("/me", protect, authorizeRoles("candidate"), getMyCandidate);
router.get('/:id', protect, authorizeRoles('admin', 'instructor'), getCandidateById);

router.put('/:id', protect, authorizeRoles('admin', 'instructor'), updateCandidate);

router.delete('/:id', protect, authorizeRoles('admin'), deleteCandidate);

export default router;
