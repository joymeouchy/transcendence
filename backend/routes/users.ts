import { Router } from "express";
import { PrismaClient } from "../generated/prisma/client";
import jwt from "jsonwebtoken";
import { authHelper, AuthRequest } from "../src/helpers/auth_helpers";

const router = Router();
const prisma = new PrismaClient();

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

export default router;
