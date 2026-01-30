import { Request, Response } from 'express';
import { Candidate } from '../models/Candidate';

/*
  CREATE candidate
  POST /api/candidates
 */
export const createCandidate = async (req: Request, res: Response) => {
  try {
    const { user, instructor } = req.body;

    const existingCandidate = await Candidate.findOne({ user });
    if (existingCandidate) {
      return res.status(400).json({ message: 'Candidate already exists for this user' });
    }

    const candidate = await Candidate.create({
      user,
      instructor,
    });

    res.status(201).json(candidate);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create candidate' });
  }
};

/*
 READ all candidates
 GET /api/candidates
 */
export const getCandidates = async (_req: Request, res: Response) => {
  try {
    const candidates = await Candidate.find()
      .populate('user', 'name email role')
      .populate('instructor');

    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch candidates' });
  }
};

/*
  READ single candidate
  GET /api/candidates/:id
 */
export const getCandidateById = async (req: Request, res: Response) => {
  try {
    const candidate = await Candidate.findById(req.params.id)
      .populate('user', 'name email role')
      .populate('instructor');

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.json(candidate);
  } catch (error) {
    res.status(400).json({ message: 'Invalid candidate ID' });
  }
};

/*
  UPDATE candidate
  PUT /api/candidates/:id
 */
export const updateCandidate = async (req: Request, res: Response) => {
  try {
    const { instructor, totalLessons } = req.body;

    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { instructor, totalLessons },
      { new: true }
    );

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.json(candidate);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update candidate' });
  }
};

/*
  DELETE candidate
  DELETE /api/candidates/:id
 */
export const deleteCandidate = async (req: Request, res: Response) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete candidate' });
  }
};
