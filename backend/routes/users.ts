import { Router } from "express";
import fs from "fs";
import path from "path";
import { PrismaClient } from "../generated/prisma/client";
import jwt from "jsonwebtoken";
import { authHelper, AuthRequest } from "../src/helpers/auth_helpers";
import { avatarUpload, AVATAR_UPLOAD_DIR } from "../src/helpers/upload_helpers";

const router = Router();
import prisma from "../src/prisma";

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get the current authenticated user's profile
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token, e.g. "Bearer <token>"
 *     responses:
 *       200:
 *         description: Current user's profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 avatarUrl:
 *                   type: string
 *                 isOnline:
 *                   type: boolean
 *                 wins:
 *                   type: integer
 *                 losses:
 *                   type: integer
 *                 totalMatches:
 *                   type: integer
 *                 winRate:
 *                   type: integer
 *       401:
 *         description: No token provided
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/me", authHelper, async (req: AuthRequest, res) => {
  console.log("userId from token:", req.userId); // add this
  try {
    const userId = req.userId!;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        isOnline: true,
        provider: true,
        preferredTheme: true,
        matchesAsPlayer1: { select: { id: true } },
        matchesAsPlayer2: { select: { id: true } },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const wins = await prisma.match.count({
      where: { winnerId: user.id },
    });

    const totalMatches =
      user.matchesAsPlayer1.length + user.matchesAsPlayer2.length;
    const losses = totalMatches - wins;

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      isOnline: user.isOnline,
      provider: user.provider,
      preferredTheme: user.preferredTheme,
      wins,
      losses,
      totalMatches,
      winRate: totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0,
    });
  } catch (err) {
    console.error("GET /me error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Search users by username
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Username to search for
 *     responses:
 *       200:
 *         description: List of matching users
 *       400:
 *         description: Missing search query
 *       500:
 *         description: Server error
 */
router.get("/search", authHelper, async (req: AuthRequest, res) => {
  try {
    const query = req.query.q as string;
    const currentUserId = req.userId!;

    if (!query) {
      return res.status(400).json({ error: "Missing search query" });
    }

    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: query,
          mode: "insensitive", // doesn't care if it's upper or lower case
        },
        NOT: { id: currentUserId }, // exclude the user itself from searching his name
      },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        isOnline: true,
      },
      take: 10, // limit to 10 results
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @swagger
 * /users/username:
 *   patch:
 *     summary: Update username
 *     responses:
 *       200:
 *         description: Username updated
 *       400:
 *         description: Username already taken
 *       401:
 *         description: No token provided
 */
router.patch("/username", authHelper, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    // check if username is already taken
    const existing = await prisma.user.findUnique({
      where: { username },
    });

    if (existing && existing.id !== userId) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { username },
    });

    res.json({ message: "Username updated", username: updated.username });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user profile by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 avatarUrl:
 *                   type: string
 *                 isOnline:
 *                   type: boolean
 *                 wins:
 *                   type: integer
 *                 losses:
 *                   type: integer
 *                 totalMatches:
 *                   type: integer
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        provider: true,
        isOnline: true,
        matchesAsPlayer1: { select: { id: true } },
        matchesAsPlayer2: { select: { id: true } },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const wins = await prisma.match.count({
      where: { winnerId: userId },
    });

    const totalMatches =
      user.matchesAsPlayer1.length + user.matchesAsPlayer2.length;
    const losses = totalMatches - wins;

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      isOnline: user.isOnline,
      provider: user.provider,
      wins,
      losses,
      totalMatches,
      winRate: totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @swagger
 * /users/me/avatar:
 *   post:
 *     summary: Upload/change the current authenticated user's profile picture
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token, e.g. "Bearer <token>"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *       400:
 *         description: No file uploaded or invalid file
 *       401:
 *         description: No token provided
 *       500:
 *         description: Server error
 */
router.post(
  "/me/avatar",
  authHelper,
  (req: AuthRequest, res, next) => {
    avatarUpload.single("avatar")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message || "Upload failed" });
      }
      next();
    });
  },
  async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const previousUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { avatarUrl: true },
      });

      const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/avatars/${req.file.filename}`;

      const user = await prisma.user.update({
        where: { id: userId },
        data: { avatarUrl },
        select: { avatarUrl: true },
      });

      // clean up the previously uploaded file, if it was one of ours
      if (previousUser?.avatarUrl?.includes("/uploads/avatars/")) {
        const previousFilename = path.basename(previousUser.avatarUrl);
        const previousFilePath = path.join(AVATAR_UPLOAD_DIR, previousFilename);

        fs.unlink(previousFilePath, () => {});
      }

      res.json({ avatarUrl: user.avatarUrl });
    } catch (err) {
      console.error("POST /me/avatar error:", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

export default router;
