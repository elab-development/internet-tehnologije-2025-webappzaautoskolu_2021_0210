import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';
import { Response } from 'express';
import { AuthRequest } from '../types/AuthRequest';

const router = Router();

router.get('/user', protect, (req: AuthRequest, res: Response) => {
  res.json({
    message: 'User access granted',
    user: req.user,
  });
});


router.get(
  '/admin',
  protect,
  authorizeRoles('admin'),
  (req: AuthRequest, res: Response) => {
    res.json({ message: 'Admin access granted' });
  }
);

export default router;
