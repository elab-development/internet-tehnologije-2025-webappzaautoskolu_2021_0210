import { Response } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { Candidate } from "../models/Candidate";
import { Instructor } from "../models/Instructor";
import { Lesson } from "../models/Lesson";
import { LessonRequest } from "../models/LessonRequest";

const LESSON_DURATION_MINUTES = 60;

const isWithinAllowedHours = (hour: number, minutes: number) => {
  return hour >= 8 && hour <= 16 && minutes === 0;
};

// CANDIDATE: kreira zahtev za cas
// POST /api/lesson-requests
export const createLessonRequest = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { requestedDate } = req.body;

    if (!requestedDate) {
      return res.status(400).json({ message: "Datum termina je obavezan." });
    }

    const candidate = await Candidate.findOne({ user: req.user.id });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }

    if (!candidate.instructor) {
      return res.status(400).json({ message: "Kandidatu nije dodeljen instruktor." });
    }

    const instructor = await Instructor.findById(candidate.instructor);
    if (!instructor) {
      return res.status(404).json({ message: "Instruktor nije pronadjen." });
    }

    const requestedDateRaw = String(requestedDate);
    const match = requestedDateRaw.match(/T(\d{2}):(\d{2})/);

    if (!match) {
      return res.status(400).json({ message: "Nevazeci datum termina." });
    }

    const hour = Number(match[1]);
    const minutes = Number(match[2]);

    if (!Number.isInteger(hour) || !Number.isInteger(minutes) || !isWithinAllowedHours(hour, minutes)) {
      return res.status(400).json({
        message: "Termin mora biti izmedju 08:00 i 16:00 (pun sat).",
      });
    }

    const reqDate = new Date(requestedDateRaw);
    if (Number.isNaN(reqDate.getTime())) {
      return res.status(400).json({ message: "Nevazeci datum termina." });
    }


    const exists = await LessonRequest.findOne({
      candidate: candidate._id,
      instructor: instructor._id,
      requestedDate: reqDate,
      status: "pending",
    });

    if (exists) {
      return res.status(400).json({ message: "Vec postoji zahtev za ovaj termin." });
    }

    const lr = await LessonRequest.create({
      candidate: candidate._id,
      instructor: instructor._id,
      requestedDate: reqDate,
      duration: LESSON_DURATION_MINUTES,
      status: "pending",
    });

    return res.status(201).json(lr);
  } catch {
    return res.status(400).json({ message: "Neuspesno slanje zahteva." });
  }
};

// CANDIDATE: vidi svoje zahteve
// GET /api/lesson-requests/my
export const getMyLessonRequests = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const candidate = await Candidate.findOne({ user: req.user.id });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }

    const list = await LessonRequest.find({ candidate: candidate._id })
      .sort({ createdAt: -1 })
      .populate("instructor");

    return res.json(list);
  } catch {
    return res.status(500).json({ message: "Neuspesno ucitavanje zahteva." });
  }
};

// INSTRUCTOR: vidi pending zahteve za sebe
// GET /api/lesson-requests/instructor
export const getInstructorLessonRequests = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const instructor = await Instructor.findOne({ user: req.user.id });
    if (!instructor) {
      return res.status(404).json({ message: "Instructor profile not found" });
    }

    const list = await LessonRequest.find({ instructor: instructor._id, status: "pending" })
      .sort({ createdAt: -1 })
      .populate({
        path: "candidate",
        populate: { path: "user", select: "name email role" },
      });

    return res.json(list);
  } catch {
    return res.status(500).json({ message: "Neuspesno ucitavanje zahteva." });
  }
};

// INSTRUCTOR: odobri zahtev + kreiraj Lesson
// PATCH /api/lesson-requests/:id/approve
export const approveLessonRequest = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { title } = req.body;
    if (!title || String(title).trim().length < 3) {
      return res.status(400).json({ message: "Naziv casa je obavezan (min 3 karaktera)." });
    }

    const instructor = await Instructor.findOne({ user: req.user.id });
    if (!instructor) {
      return res.status(404).json({ message: "Instructor profile not found" });
    }

    const lr = await LessonRequest.findById(req.params.id);
    if (!lr) {
      return res.status(404).json({ message: "Zahtev nije pronadjen." });
    }

    if (String(lr.instructor) !== String(instructor._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (lr.status !== "pending") {
      return res.status(400).json({ message: "Zahtev je vec obradjen." });
    }

    const lesson = await Lesson.create({
      title: String(title).trim(),
      candidate: lr.candidate,
      instructor: lr.instructor,
      date: lr.requestedDate,
      duration: LESSON_DURATION_MINUTES,
      status: "scheduled",
    });

    lr.status = "approved";
    lr.instructorTitle = String(title).trim();
    lr.rejectionReason = "";
    lr.duration = LESSON_DURATION_MINUTES;
    await lr.save();

    return res.json({ request: lr, lesson });
  } catch {
    return res.status(400).json({ message: "Neuspesno odobravanje zahteva." });
  }
};

// INSTRUCTOR: odbij zahtev
// PATCH /api/lesson-requests/:id/reject
export const rejectLessonRequest = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { reason } = req.body;
    if (!reason || String(reason).trim().length < 3) {
      return res.status(400).json({ message: "Razlog odbijanja je obavezan (min 3 karaktera)." });
    }

    const instructor = await Instructor.findOne({ user: req.user.id });
    if (!instructor) {
      return res.status(404).json({ message: "Instructor profile not found" });
    }

    const lr = await LessonRequest.findById(req.params.id);
    if (!lr) {
      return res.status(404).json({ message: "Zahtev nije pronadjen." });
    }

    if (String(lr.instructor) !== String(instructor._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (lr.status !== "pending") {
      return res.status(400).json({ message: "Zahtev je vec obradjen." });
    }

    lr.status = "rejected";
    lr.rejectionReason = String(reason).trim();
    lr.instructorTitle = "";
    lr.duration = LESSON_DURATION_MINUTES;
    await lr.save();

    return res.json(lr);
  } catch {
    return res.status(400).json({ message: "Neuspesno odbijanje zahteva." });
  }
};

