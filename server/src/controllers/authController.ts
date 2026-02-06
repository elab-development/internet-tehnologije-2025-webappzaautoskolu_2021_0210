import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Instructor } from "../models/Instructor";
import { Candidate } from "../models/Candidate";
import { Types } from "mongoose";



async function pickInstructorWithLeastCandidates() {
  const instructors = await Instructor.find().lean();
  if (instructors.length === 0) return null;

  // prebroj kandidate po instruktoru
  const counts = await Candidate.aggregate([
    { $match: { instructor: { $exists: true, $ne: null } } },
    { $group: { _id: "$instructor", count: { $sum: 1 } } },
  ]);

  const map = new Map<string, number>();
  for (const c of counts) map.set(String(c._id), c.count);

  // sortiraj instruktore po broju kandidata, pa po _id (stabilno)
  const sorted = [...instructors].sort((a: any, b: any) => {
    const ca = map.get(String(a._id)) ?? 0;
    const cb = map.get(String(b._id)) ?? 0;
    if (ca !== cb) return ca - cb;
    return String(a._id).localeCompare(String(b._id));
  });

  return sorted[0]?._id ?? null;
}

function signToken(payload: { id: string; role: string }) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

export const register = async (req: Request, res: Response) => {
  try {
    const name = String(req.body.name ?? "").trim();
    const email = String(req.body.email ?? "").trim().toLowerCase();
    const password = String(req.body.password ?? "");

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nedostaju podaci (name, email, password)." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email je već u upotrebi." });
    }

    // ✅ HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // kreiraj user-a kao kandidata
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "candidate",
    });

    // dodeli instruktora sa najmanje kandidata
    const instructorId = await pickInstructorWithLeastCandidates();

    // kreiraj Candidate profil (ako nema instruktora, ostaje null/undefined)
    const candidate = await Candidate.create({
      user: user._id,
      instructor: instructorId ?? undefined,
      totalLessons: 0,
    });

    const token = signToken({ id: user._id.toString(), role: user.role });

    return res.status(201).json({
      token,
      user: { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
      candidateId: candidate._id.toString(),
      instructorId: instructorId ? instructorId.toString() : null,
    });
  } catch (err) {
    return res.status(500).json({ message: "Register failed." });
  }
};
export const login = async (req:Request, res:Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return res.json({
    token,
    user: { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
  });
};
