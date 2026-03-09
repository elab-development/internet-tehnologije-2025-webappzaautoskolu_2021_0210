import { Request, Response } from "express";
import { Availability } from "../models/Availability";
import { Instructor } from "../models/Instructor";
import { Candidate } from "../models/Candidate";
import { Lesson } from "../models/Lesson";

export const addAvailability = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const instructor = await Instructor.findOne({ user: user.id });

    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    const { date } = req.body;

    const existing = await Availability.findOne({
      instructor: instructor._id,
      date: new Date(date)
    });

    if (existing) {
      return res.status(400).json({ message: "Slot already exists" });
    }

    const slot = await Availability.create({
      instructor: instructor._id,
      date,
      duration: 60,
      booked: false
    });

    res.status(201).json(slot);

  } catch (e) {
    res.status(500).json({ message: "Failed to create slot" });
  }
};

export const getInstructorAvailability = async (req: Request, res: Response) => {
  try {

    const user = (req as any).user;

    const candidate = await Candidate.findOne({ user: user.id });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const slots = await Availability.find({
      instructor: candidate.instructor,
      booked: false
    }).sort({ date: 1 });

    res.json(slots);

  } catch {
    res.status(500).json({ message: "Failed to fetch availability" });
  }
};

export const getInstructorSlots = async (req: Request, res: Response) => {

  const user = (req as any).user;

  const instructor = await Instructor.findOne({ user: user.id });

  if (!instructor) {
    return res.status(404).json({ message: "Instructor not found" });
  }

  const slots = await Availability.find({
    instructor: instructor._id
  }).sort({ date: 1 });

  res.json(slots);
};

export const bookLesson = async (req: Request, res: Response) => {
  try {

    const user = (req as any).user;

    const candidate = await Candidate.findOne({ user: user.id });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const slot = await Availability.findById(req.params.id);

    if (!slot || slot.booked) {
      return res.status(400).json({ message: "Slot not available" });
    }

    const lesson = await Lesson.create({
      title: "Čas vožnje",
      candidate: candidate._id,
      instructor: slot.instructor,
      date: slot.date,
      duration: slot.duration,
      status: "scheduled"
    });

    slot.booked = true;
    await slot.save();

    res.status(201).json(lesson);

  } catch {
    res.status(500).json({ message: "Booking failed" });
  }
};