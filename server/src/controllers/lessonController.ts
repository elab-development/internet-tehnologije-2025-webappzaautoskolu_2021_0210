import { Request, Response } from "express";
import { Lesson } from "../models/Lesson";
import { Candidate } from "../models/Candidate";
import { Instructor } from "../models/Instructor";



type AuthedUser = { id: string; role: "admin" | "instructor" | "candidate" };

export const createLesson = async (req: Request, res: Response) => {
  try {
    const { title, candidate, instructor, date, duration, status } = req.body;

    if (!title || String(title).trim().length < 3) {
      return res.status(400).json({
        message: "Naziv časa je obavezan (minimum 3 karaktera).",
      });
    }

    const lesson = await Lesson.create({
      title: String(title).trim(),
      candidate,
      instructor,
      date,
      duration,
      status: status ?? "scheduled",
    });

    return res.status(201).json(lesson);
  } catch (error) {
    return res.status(400).json({ message: "Failed to create lesson" });
  }
};

export const getLessons = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id: string; role?: string } | undefined;

    if (!user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const role = (user.role || "").toLowerCase();
    const now = new Date();

    // ADMIN: može sve + može global update (opciono)
    if (role === "admin") {
      await Lesson.updateMany(
        { status: "scheduled", date: { $lt: now } },
        { $set: { status: "completed" } }
      );

      const lessons = await Lesson.find()
        .sort({ date: 1 })
        .populate({ path: "candidate", populate: { path: "user", select: "name email" } })
        .populate({ path: "instructor", populate: { path: "user", select: "name email" } });

      return res.json(lessons);
    }

    // INSTRUCTOR: update samo njegovih časova
    if (role === "instructor") {
      const instructor = await Instructor.findOne({ user: user.id });

      if (!instructor) {
        return res.status(404).json({ message: "Instructor profile not found" });
      }

      await Lesson.updateMany(
        { instructor: instructor._id, status: "scheduled", date: { $lt: now } },
        { $set: { status: "completed" } }
      );

      const lessons = await Lesson.find({ instructor: instructor._id })
        .sort({ date: 1 })
        .populate({ path: "candidate", populate: { path: "user", select: "name email" } })
        .populate({ path: "instructor", populate: { path: "user", select: "name email" } });

      return res.json(lessons);
    }

    // CANDIDATE: update samo njegovih časova
    const candidate = await Candidate.findOne({ user: user.id });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }

    await Lesson.updateMany(
      { candidate: candidate._id, status: "scheduled", date: { $lt: now } },
      { $set: { status: "completed" } }
    );

    const lessons = await Lesson.find({ candidate: candidate._id })
      .sort({ date: 1 })
      .populate({ path: "candidate", populate: { path: "user", select: "name email" } })
      .populate({ path: "instructor", populate: { path: "user", select: "name email" } });

    return res.json(lessons);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch lessons" });
  }
};

export const getLessonById = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as AuthedUser | undefined;

    const lesson = await Lesson.findById(req.params.id)
      .populate({
        path: "candidate",
        populate: { path: "user", select: "name email" },
      })
      .populate({
        path: "instructor",
        populate: { path: "user", select: "name email" },
      });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // security: kandidat ne sme da vidi tuđ čas po ID
    if (user?.role === "candidate") {
      const candidate = await Candidate.findOne({ user: user.id });
      if (!candidate) {
        return res.status(404).json({ message: "Candidate profile not found" });
      }

      const lessonCandidateId =
        typeof (lesson as any).candidate === "object"
          ? String((lesson as any).candidate._id)
          : String((lesson as any).candidate);

      if (lessonCandidateId !== String(candidate._id)) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    return res.json(lesson);
  } catch (error) {
    return res.status(400).json({ message: "Invalid lesson ID" });
  }
};

export const updateLesson = async (req: Request, res: Response) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    return res.json(lesson);
  } catch (error) {
    return res.status(400).json({ message: "Failed to update lesson" });
  }
};

export const deleteLesson = async (req: Request, res: Response) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    return res.json({ message: "Lesson deleted" });
  } catch (error) {
    return res.status(400).json({ message: "Failed to delete lesson" });
  }
};
