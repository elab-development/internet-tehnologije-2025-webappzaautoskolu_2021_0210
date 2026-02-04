import { Response } from 'express';
import { Candidate } from '../models/Candidate';
import { Instructor } from '../models/Instructor';
import { AuthRequest } from '../types/AuthRequest';

/*
  CREATE candidate
  POST /api/candidates
  (route treba da bude admin-only)
*/
export const createCandidate = async (req: AuthRequest, res: Response) => {
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

    const populated = await Candidate.findById(candidate._id)
      .populate('user', 'name email role')
      .populate('instructor');

    return res.status(201).json(populated ?? candidate);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to create candidate' });
  }
};

/*
  READ all candidates
  GET /api/candidates

  ✅ admin -> all
  ✅ instructor -> only candidates assigned to that instructor
  ❌ candidate -> forbidden
*/
export const getCandidates = async (req: AuthRequest, res: Response) => {
  try {
    // Admin: vidi sve
    if (req.user?.role === 'admin') {
      const candidates = await Candidate.find()
        .populate('user', 'name email role')
        .populate('instructor');

      return res.json(candidates);
    }

    // Instructor: vidi samo svoje
    if (req.user?.role === 'instructor') {
      const instructor = await Instructor.findOne({ user: req.user.id });
      if (!instructor) {
        return res.status(404).json({ message: 'Instructor profile not found' });
      }

      const candidates = await Candidate.find({ instructor: instructor._id })
        .populate('user', 'name email role')
        .populate('instructor');

      return res.json(candidates);
    }

    // Candidate ili drugi: zabrana
    return res.status(403).json({ message: 'Forbidden' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch candidates' });
  }
};

/*
  READ single candidate
  GET /api/candidates/:id

   admin sve
  instructor samo svoje
   candidatezabranjeno
*/
export const getCandidateById = async (req: AuthRequest, res: Response) => {
  try {
    const candidate = await Candidate.findById(req.params.id)
      .populate('user', 'name email role')
      .populate('instructor');

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Admin: može sve
    if (req.user?.role === 'admin') {
      return res.json(candidate);
    }

    // Instructor: samo svoje
    if (req.user?.role === 'instructor') {
      const instructor = await Instructor.findOne({ user: req.user.id });
      if (!instructor) {
        return res.status(404).json({ message: 'Instructor profile not found' });
      }

      const candidateInstructorId = String(candidate.instructor ?? '');
      if (candidateInstructorId !== String(instructor._id)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      return res.json(candidate);
    }

    // Candidate ili drugi zabrana
    return res.status(403).json({ message: 'Forbidden' });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid candidate ID' });
  }
};

/*
  UPDATE candidate
  PUT /api/candidates/:id

  admin -> sve
  instructor -> samo svje kandidate
*/
export const updateCandidate = async (req: AuthRequest, res: Response) => {
  try {
    const { instructor, totalLessons } = req.body;

    // Ako je instruktor, ne dozvoli da update-uje tuđe kandidate
    if (req.user?.role === 'instructor') {
      const me = await Instructor.findOne({ user: req.user.id });
      if (!me) {
        return res.status(404).json({ message: 'Instructor profile not found' });
      }

      const existing = await Candidate.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ message: 'Candidate not found' });
      }

      if (String(existing.instructor ?? '') !== String(me._id)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
    }

    const updated = await Candidate.findByIdAndUpdate(
      req.params.id,
      { instructor, totalLessons },
      { new: true }
    )
      .populate('user', 'name email role')
      .populate('instructor');

    if (!updated) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to update candidate' });
  }
};

/*
  DELETE candidate
  DELETE /api/candidates/:id
  (route treba da bude admin-only)
*/
export const deleteCandidate = async (req: AuthRequest, res: Response) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    return res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    return res.status(400).json({ message: 'Failed to delete candidate' });
  }
};
