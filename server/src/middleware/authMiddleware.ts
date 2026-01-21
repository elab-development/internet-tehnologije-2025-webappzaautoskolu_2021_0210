import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/AuthRequest';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  role: string;
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
    };

    req.user = decoded; 
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
