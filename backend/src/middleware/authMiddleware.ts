import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthedRequest extends Request {
  user?: { id: string };
}

export const authMiddleware = (req: AuthedRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "No token, authorization denied" });

  const token = header.replace("Bearer ", "");
  try {
    const secret = process.env.JWT_SECRET || "dev_secret";
    const decoded = jwt.verify(token, secret) as { id: string };
    req.user = { id: decoded.id };   // ✅ standardize on req.user
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};