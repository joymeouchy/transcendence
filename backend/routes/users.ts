import { Router } from "express";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { FriendshipStatus } from "../generated/prisma/client";
import { authHelper, AuthRequest } from "../src/helpers/auth_helpers";
import { avatarUpload, AVATAR_UPLOAD_DIR } from "../src/helpers/upload_helpers";
import { isUserOnline } from "../src/online";
import prisma from "../src/prisma";

const router = Router();

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
        provider: true,
        preferredTheme: true,
        preferredWallpaper: true,
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
      isOnline: isUserOnline(user.id),
      provider: user.provider,
      preferredTheme: user.preferredTheme,
      preferredWallpaper: user.preferredWallpaper,
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
 * /users/me/matches:
 *   get:
 *     summary: Get the current authenticated user's match history
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token, e.g. "Bearer <token>"
 *     responses:
 *       200:
 *         description: List of the user's past matches, most recent first
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                   result:
 *                     type: string
 *                     enum: [win, loss, draw]
 *                   myScore:
 *                     type: integer
 *                   opponentScore:
 *                     type: integer
 *                   opponent:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       username:
 *                         type: string
 *                       avatarUrl:
 *                         type: string
 *                         nullable: true
 *       401:
 *         description: No token provided
 *       500:
 *         description: Server error
 */
router.get("/me/matches", authHelper, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;

    const matches = await prisma.match.findMany({
      where: {
        OR: [{ player1Id: userId }, { player2Id: userId }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        player1: { select: { id: true, username: true, avatarUrl: true } },
        player2: { select: { id: true, username: true, avatarUrl: true } },
      },
    });

    const history = matches.map((match) => {
      const isPlayer1 = match.player1Id === userId;
      const opponent = isPlayer1 ? match.player2 : match.player1;
      const myScore = isPlayer1 ? match.player1Score : match.player2Score;
      const opponentScore = isPlayer1 ? match.player2Score : match.player1Score;
      const result =
        match.winnerId === null
          ? "draw"
          : match.winnerId === userId
            ? "win"
            : "loss";

      return {
        id: match.id,
        createdAt: match.createdAt,
        opponent,
        myScore,
        opponentScore,
        result,
      };
    });

    res.json(history);
  } catch (err) {
    console.error("GET /me/matches error:", err);
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
      },
      take: 10, // limit to 10 results
    });

    res.json(
      users.map((u) => ({ ...u, isOnline: isUserOnline(u.id) })),
    );
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// lower bound of the 95% Wilson score interval for a win rate: the win rate we can be
// confident a player has at least, which stops few-match players topping the board
function wilsonLowerBound(wins: number, total: number): number {
  if (total === 0) return 0;
  const z = 1.96;
  const p = wins / total;
  const z2 = z * z;
  return (
    (p + z2 / (2 * total) - z * Math.sqrt((p * (1 - p) + z2 / (4 * total)) / total)) /
    (1 + z2 / total)
  );
}

/**
 * @swagger
 * /users/leaderboard:
 *   get:
 *     summary: Get leaderboard rankings for all players or only the current user's friends
 *     description: >
 *       Players are ranked by the lower bound of the Wilson score interval (95%) on
 *       their win rate, so a long winning record outranks a lucky short one
 *       (e.g. 50W/5L ranks above 1W/0L). Ties are broken by wins, then fewest losses,
 *       then username. Players with no matches are included at the bottom.
 *       The "friends" scope always includes the current user.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token, e.g. "Bearer <token>"
 *       - in: query
 *         name: scope
 *         required: false
 *         schema:
 *           type: string
 *           enum: [all, friends]
 *           default: all
 *     responses:
 *       200:
 *         description: Players sorted by rank
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   rank:
 *                     type: integer
 *                     example: 1
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   avatarUrl:
 *                     type: string
 *                     nullable: true
 *                   wins:
 *                     type: integer
 *                   losses:
 *                     type: integer
 *                   totalMatches:
 *                     type: integer
 *                   winRate:
 *                     type: integer
 *                     description: Percentage, rounded (0-100)
 *                     example: 67
 *       400:
 *         description: Invalid scope
 *       401:
 *         description: No token provided
 *       500:
 *         description: Server error
 */
router.get("/leaderboard", authHelper, async (req: AuthRequest, res) => {
  try {
    const currentUserId = req.userId!;
    const scope = (req.query.scope as string) || "all";

    if (scope !== "all" && scope !== "friends") {
      return res.status(400).json({ error: "Invalid scope, use 'all' or 'friends'" });
    }

    // restrict to the current user + accepted friends when scope is "friends"
    let userIds: number[] | undefined;
    if (scope === "friends") {
      const friendships = await prisma.friendship.findMany({
        where: {
          status: FriendshipStatus.accepted,
          OR: [{ senderId: currentUserId }, { receiverId: currentUserId }],
        },
        select: { senderId: true, receiverId: true },
      });

      userIds = [
        currentUserId,
        ...friendships.map((f) =>
          f.senderId === currentUserId ? f.receiverId : f.senderId,
        ),
      ];
    }

    const idFilter = userIds ? { in: userIds } : {};

    // count wins and matches played per user in the DB instead of loading every match
    const [users, winCounts, p1Counts, p2Counts] = await Promise.all([
      prisma.user.findMany({
        where: { id: idFilter },
        select: { id: true, username: true, avatarUrl: true },
      }),
      prisma.match.groupBy({
        by: ["winnerId"],
        where: { winnerId: { not: null, ...idFilter } },
        _count: { _all: true },
      }),
      prisma.match.groupBy({
        by: ["player1Id"],
        where: { player1Id: idFilter },
        _count: { _all: true },
      }),
      prisma.match.groupBy({
        by: ["player2Id"],
        where: { player2Id: idFilter },
        _count: { _all: true },
      }),
    ]);

    const wins = new Map(winCounts.map((c) => [c.winnerId!, c._count._all]));
    const played = new Map<number, number>();
    for (const c of p1Counts) played.set(c.player1Id, c._count._all);
    for (const c of p2Counts)
      played.set(c.player2Id, (played.get(c.player2Id) ?? 0) + c._count._all);

    const players = users
      .map((u) => {
        const userWins = wins.get(u.id) ?? 0;
        const totalMatches = played.get(u.id) ?? 0;

        return {
          id: u.id,
          username: u.username,
          avatarUrl: u.avatarUrl,
          wins: userWins,
          losses: totalMatches - userWins, // same as /users/:id
          totalMatches,
          winRate:
            totalMatches > 0 ? Math.round((userWins / totalMatches) * 100) : 0,
          score: wilsonLowerBound(userWins, totalMatches),
        };
      })
      .sort(
        (a, b) =>
          b.score - a.score ||
          b.wins - a.wins ||
          a.losses - b.losses ||
          a.username.localeCompare(b.username),
      )
      .map(({ score, ...p }, index) => ({ rank: index + 1, ...p }));

    res.json(players);
  } catch (err) {
    console.error("GET /leaderboard error:", err);
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
 *     description: >
 *       Returns the full profile (including email, isOnline, provider) for the
 *       account owner or an accepted friend. For anyone else, only id,
 *       username, avatarUrl, and game stats are returned.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User profile data (fields vary by friendship, see description)
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
 *                   description: Only present for the account owner or an accepted friend
 *                 avatarUrl:
 *                   type: string
 *                 isOnline:
 *                   type: boolean
 *                   description: Only present for the account owner or an accepted friend
 *                 provider:
 *                   type: string
 *                   description: Only present for the account owner or an accepted friend
 *                 wins:
 *                   type: integer
 *                 losses:
 *                   type: integer
 *                 totalMatches:
 *                   type: integer
 *                 winRate:
 *                   type: integer
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: No token provided
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/:id", authHelper, async (req: AuthRequest<{ id: string }>, res) => {
  try {
    const userId = parseInt(req.params.id);
    const requesterId = req.userId!;

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

    const stats = {
      wins,
      losses,
      totalMatches,
      winRate: totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0,
    };

    // full profile for the account owner - no need to check friendship
    if (requesterId === userId) {
      return res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        isOnline: isUserOnline(user.id),
        provider: user.provider,
        ...stats,
      });
    }

    const friendship = await prisma.friendship.findFirst({
      where: {
        status: FriendshipStatus.accepted,
        OR: [
          { senderId: requesterId, receiverId: userId },
          { senderId: userId, receiverId: requesterId },
        ],
      },
    });

    // if friends, return full profile, otherwise return limited profile
    if (friendship) {
      return res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        isOnline: isUserOnline(user.id),
        provider: user.provider,
        ...stats,
      });
    }

    // if not friends, return only username, avatar, and game stats
    res.json({
      id: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      ...stats,
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

      // the prisma extension adds BACKEND_URL when it's read
      const avatarUrl = `/uploads/avatars/${req.file.filename}`;

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

/**
 * @swagger
 * /users/me/avatar:
 *   delete:
 *     summary: Remove the current authenticated user's profile picture and reset it to the default icon
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token, e.g. "Bearer <token>"
 *     responses:
 *       200:
 *         description: Avatar removed, avatarUrl is now null (frontend shows the default icon)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 avatarUrl:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       401:
 *         description: No token provided
 *       500:
 *         description: Server error
 */
router.delete("/me/avatar", authHelper, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;

    const previousUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatarUrl: true },
    });

    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: null },
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
    console.error("DELETE /me/avatar error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
