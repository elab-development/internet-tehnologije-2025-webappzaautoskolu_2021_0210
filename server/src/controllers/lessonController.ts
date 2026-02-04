import { Request, Response } from 'express';
import { Lesson } from '../models/Lesson';


export const createLesson = async (req: Request, res: Response) => {
  try {
    const { title, candidate, instructor, date, duration, status } = req.body;

    if (!title || String(title).trim().length < 3) {
      return res.status(400).json({
        message: 'Naziv časa je obavezan (minimum 3 karaktera).',
      });
    }

    const lesson = await Lesson.create({
      title: String(title).trim(),
      candidate,
      instructor,
      date,
      duration,
      status: status ?? 'scheduled',
    });

    return res.status(201).json(lesson);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to create lesson' });
  }
};


export const getLessons = async (_req: Request, res: Response) => {
  try {
    const lessons = await Lesson.find()
      .populate('candidate')
      .populate('instructor');

    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch lessons' });
  }
};


export const getLessonById = async (req: Request, res: Response) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('candidate')
      .populate('instructor');

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json(lesson);
  } catch (error) {
    res.status(400).json({ message: 'Invalid lesson ID' });
  }
};


export const updateLesson = async (req: Request, res: Response) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json(lesson);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update lesson' });
  }
};


export const deleteLesson = async (req: Request, res: Response) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json({ message: 'Lesson deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete lesson' });
  }
};
