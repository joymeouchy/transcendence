import { Router } from "express";
import { FriendshipStatus } from "../generated/prisma/client";
import { authHelper, AuthRequest } from "../src/helpers/auth_helpers";
import { getIo } from "../src/io";
import { onlineUsers } from "../src/online";
import prisma from "../src/prisma";

const router = Router();

const MAX_CONTENT_LENGTH = 2000;

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Send a chat message to a friend
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
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiverId
 *               - content
 *             properties:
 *               receiverId:
 *                 type: integer
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent
 *       400:
 *         description: Invalid receiverId, empty/too-long content, or messaging yourself
 *       401:
 *         description: No token provided
 *       403:
 *         description: You can only message friends
 *       500:
 *         description: Server error
 */
router.post("/", authHelper, async (req: AuthRequest, res) => {
  try {
    const senderId = req.userId!;
    const { receiverId, content } = req.body;

    if (!Number.isInteger(receiverId)) {
      return res.status(400).json({ error: "receiverId is required" });
    }

    if (receiverId === senderId) {
      return res.status(400).json({ error: "Cannot message yourself" });
    }

    if (typeof content !== "string" || content.trim().length === 0) {
      return res.status(400).json({ error: "Message content is required" });
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      return res.status(400).json({ error: "Message is too long" });
    }

    const friendship = await prisma.friendship.findFirst({
      where: {
        status: FriendshipStatus.accepted,
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    if (!friendship) {
      return res.status(403).json({ error: "You can only message friends" });
    }

    const message = await prisma.message.create({
      data: { senderId, receiverId, content },
      include: {
        sender: { select: { id: true, username: true, avatarUrl: true } },
      },
    });

    const receiverSockets = onlineUsers.get(receiverId);
    if (receiverSockets) {
      for (const socketId of receiverSockets) {
        getIo().to(socketId).emit("receive_message", message);
      }
    }

    res.status(201).json(message);
  } catch (err) {
    console.error("POST /messages error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @swagger
 * /messages/{friendId}:
 *   get:
 *     summary: Get the message history between the current user and a friend
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token, e.g. "Bearer <token>"
 *       - in: path
 *         name: friendId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: before
 *         required: false
 *         schema:
 *           type: integer
 *         description: Return messages older than this message id (for pagination)
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: Max messages to return (default 30, max 100)
 *     responses:
 *       200:
 *         description: Messages between the two users, oldest first
 *       400:
 *         description: Invalid friendId
 *       401:
 *         description: No token provided
 *       500:
 *         description: Server error
 */
router.get("/:friendId", authHelper, async (req: AuthRequest<{ friendId: string }>, res) => {
  try {
    const userId = req.userId!;
    const friendId = parseInt(req.params.friendId);

    if (isNaN(friendId)) {
      return res.status(400).json({ error: "Invalid friendId" });
    }

    const limit = Math.min(parseInt(req.query.limit as string) || 30, 100);
    const before = parseInt(req.query.before as string);

    const friendship = await prisma.friendship.findFirst({
      where: {
        status: FriendshipStatus.accepted,
        OR: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId },
        ],
      },
    });
    if (!friendship) {
      return res.status(403).json({ error: "You can only message friends" });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId },
        ],
        ...(isNaN(before) ? {} : { id: { lt: before } }),
      },
      orderBy: { id: "desc" },
      take: limit,
    });

    res.json(messages.reverse());
  } catch (err) {
    console.error("GET /messages/:friendId error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
