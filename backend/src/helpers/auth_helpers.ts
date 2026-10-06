import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../urls";

export interface AuthRequest<P = Record<string, string>> extends Request<P> {
  userId?: number;
}

export const authHelper = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// password rules shared by register, reset-password and change-password.
// returns an error message, or null if the password is valid.
export const validatePassword = (password: unknown): string | null => {
  if (typeof password !== "string" || password.length === 0) {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  // max is 72 bytes because bcrypt silently ignores anything after that
  if (Buffer.byteLength(password, "utf8") > 72) {
    return "Password must be at most 72 characters";
  }
  // this is a regex that checks if the password contains at least one letter and one number
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return "Password must contain at least one letter and one number";
  }
  return null;
};

