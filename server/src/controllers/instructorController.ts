import { Request, Response } from 'express';
import { Instructor } from '../models/Instructor';


export const createInstructor = async (req: Request, res: Response) => {
  try {
    const { user, licenseNumber, experienceYears } = req.body;

    const existingInstructor = await Instructor.findOne({ user });
    if (existingInstructor) {
      return res.status(400).json({ message: 'Instructor already exists for this user' });
    }

    const instructor = await Instructor.create({
      user,
      licenseNumber,
      experienceYears,
    });

    res.status(201).json(instructor);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create instructor' });
  }
};


export const getInstructors = async (_req: Request, res: Response) => {
  try {
    const instructors = await Instructor.find().populate('user', 'name email role');
    res.json(instructors);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch instructors' });
  }
};


export const getInstructorById = async (req: Request, res: Response) => {
  try {
    const instructor = await Instructor.findById(req.params.id).populate(
      'user',
      'name email role'
    );

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    res.json(instructor);
  } catch (error) {
    res.status(400).json({ message: 'Invalid instructor ID' });
  }
};


export const updateInstructor = async (req: Request, res: Response) => {
  try {
    const { licenseNumber, experienceYears } = req.body;

    const instructor = await Instructor.findByIdAndUpdate(
      req.params.id,
      { licenseNumber, experienceYears },
      { new: true }
    );

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    res.json(instructor);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update instructor' });
  }
};


export const deleteInstructor = async (req: Request, res: Response) => {
  try {
    const instructor = await Instructor.findByIdAndDelete(req.params.id);

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    res.json({ message: 'Instructor deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete instructor' });
  }
};
