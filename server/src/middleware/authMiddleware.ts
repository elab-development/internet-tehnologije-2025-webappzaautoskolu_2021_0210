import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";
import jwt from "jsonwebtoken";

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const token = auth.split(" ")[1]; //izvlaci od bearer

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;             //da li je token validan/istekao/da li je potpis ispravan

    const id = decoded?.id || decoded?._id || decoded?.userId || decoded?.sub;
    const role = decoded?.role;

    if (!id || !role) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = { id: String(id), role: String(role) } as any;

    next(); //ili se ruta nikad ne zavrsi
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
