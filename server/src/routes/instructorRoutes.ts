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
/**
 * @swagger
 * /api/instructors:
 *   get:
 *     summary: Get all instructors
 *     tags: [Instructors]
 *     responses:
 *       200:
 *         description: List of instructors
 */
router.get('/', protect, getInstructors);
router.get('/:id', protect, getInstructorById);
/**
 * @swagger
 * /api/instructors/{id}:
 *   put:
 *     summary: Update instructor
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Instructor ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               licenseNumber:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Instructor updated
 *       404:
 *         description: Instructor not found
 */
router.put('/:id', protect, authorizeRoles('admin'), updateInstructor);
/**
 * @swagger
 * /api/instructors/{id}:
 *   delete:
 *     summary: Delete instructor
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Instructor ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Instructor deleted
 *       404:
 *         description: Instructor not found
 */
router.delete('/:id', protect, authorizeRoles('admin'), deleteInstructor);

export default router;
