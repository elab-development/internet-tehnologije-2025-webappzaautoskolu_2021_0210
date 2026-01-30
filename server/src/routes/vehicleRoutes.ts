import { Router } from 'express';
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from '../controllers/vehicleController';

import { protect } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = Router();

router.post('/', protect, authorizeRoles('admin'), createVehicle);
router.get('/', protect, getVehicles);
router.get('/:id', protect, getVehicleById);
router.put('/:id', protect, authorizeRoles('admin'), updateVehicle);
router.delete('/:id', protect, authorizeRoles('admin'), deleteVehicle);

export default router;
