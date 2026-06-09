import { Router } from "express";
import { PrismaClient } from "../generated/prisma/client";

const router = Router();
const prisma = new PrismaClient();

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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        provider: true,
        matchesAsPlayer1: { select: { id: true } },
        matchesAsPlayer2: { select: { id: true } },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const wins = 0; // will add later when match results are saved
    const losses = 0;

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      wins,
      losses,
      totalMatches: user.matchesAsPlayer1.length + user.matchesAsPlayer2.length,
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;