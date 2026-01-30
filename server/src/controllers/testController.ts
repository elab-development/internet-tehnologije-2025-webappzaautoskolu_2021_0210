import { Request, Response } from 'express';
import { Test } from '../models/Test';

export const createTest = async (req: Request, res: Response) => {
  try {
    const test = await Test.create(req.body);
    res.status(201).json(test);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create test' });
  }
};

export const getTests = async (_req: Request, res: Response) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch {
    res.status(500).json({ message: 'Failed to fetch tests' });
  }
};

export const getTestById = async (req: Request, res: Response) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.json(test);
  } catch {
    res.status(400).json({ message: 'Invalid test ID' });
  }
};

export const updateTest = async (req: Request, res: Response) => {
  try {
    const test = await Test.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.json(test);
  } catch {
    res.status(400).json({ message: 'Failed to update test' });
  }
};

export const deleteTest = async (req: Request, res: Response) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.json({ message: 'Test deleted' });
  } catch {
    res.status(400).json({ message: 'Failed to delete test' });
  }
};
