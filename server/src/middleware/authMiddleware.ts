import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";
import jwt from "jsonwebtoken";

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const token = auth.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // podrži različite payload oblike
    const id = decoded?.id || decoded?._id || decoded?.userId || decoded?.sub;
    const role = decoded?.role;

    if (!id || !role) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = { id: String(id), role: String(role) } as any;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
