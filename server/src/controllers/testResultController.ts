import { Request, Response } from 'express';
import { TestResult } from '../models/TestResult';

export const createTestResult = async (req: Request, res: Response) => {
  try {
    const result = await TestResult.create(req.body);
    res.status(201).json(result);
  } catch {
    res.status(400).json({ message: 'Failed to create test result' });
  }
};

export const getTestResults = async (_req: Request, res: Response) => {
  const results = await TestResult.find()
    .populate('candidate')
    .populate('test');
  res.json(results);
};
