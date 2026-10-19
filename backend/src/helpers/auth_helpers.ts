import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../urls";

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;

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

// emails are stored and looked up lowercase, so "Rawan@x.com" and
// "rawan@x.com" are the same account. returns "" for anything that isn't a string.
export const normalizeEmail = (email: unknown): string =>
  typeof email === "string" ? email.trim().toLowerCase() : "";

// expects the already normalized email. returns an error message, or null if valid.
export const validateEmail = (email: string): string | null => {
  if (email.length === 0) {
    return "Email is required";
  }
  // 254 is the longest address email servers accept
  if (email.length > 254) {
    return "Email is too long";
  }
  // something@something.something with no spaces. whether the address really
  // exists can't be checked here, only by sending it a mail
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Invalid email address";
  }
  return null;
};

// username rules shared by register and the change-username route.
// expects the already trimmed username. returns an error message, or null if valid.
export const validateUsername = (username: unknown): string | null => {
  if (typeof username !== "string" || username.length === 0) {
    return "Username is required";
  }
  if (
    username.length < USERNAME_MIN_LENGTH ||
    username.length > USERNAME_MAX_LENGTH
  ) {
    return `Username must be ${USERNAME_MIN_LENGTH}-${USERNAME_MAX_LENGTH} characters`;
  }
  return null;
};
