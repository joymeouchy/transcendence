import { Router } from "express";
import { PrismaClient } from "../generated/prisma/client";
import jwt from "jsonwebtoken";

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
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // "Bearer <token>"
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkey",
    ) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
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
