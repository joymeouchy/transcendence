// GET-> Read/fetch data	(Get user profile)
// POST-> Create new data	(Create a new post)
// PUT-> Replace entire resource	(Replace entire user object)
// PATCH-> Update part of a resource	(Update just the status field)
// DELETE-> Delete data	(Delete a friendship)

import { Router } from "express";
import { FriendshipStatus } from "../generated/prisma/client";
import { authHelper, AuthRequest } from "../src/helpers/auth_helpers";
import { isUserOnline } from "../src/online";
import prisma from "../src/prisma";

const router = Router();

/**
 * @swagger
 * /friendships/send:
 *   post:
 *     summary: Send a friend request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senderId:
 *                 type: integer
 *               receiverId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Friend request sent
 *       400:
 *         description: Friendship already exists
 */
router.post("/send", authHelper, async (req: AuthRequest, res) => {
  try {
    const senderId = req.userId!;
    const { receiverId } = req.body;

    if (senderId === receiverId) {
      return res.status(400).json({ error: "Cannot add yourself as a friend" });
    }

    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    if (existing) {
      return res.status(400).json({ error: "Friendship already exists" });
    }

    const friendship = await prisma.friendship.create({
      data: {
        senderId,
        receiverId,
        status: FriendshipStatus.pending,
      },
    });

    res.status(201).json(friendship);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @swagger
 * /friendships/accept/{id}:
 *   patch:
 *     summary: Accept a friend request
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Friend request accepted
 *       400:
 *         description: Invalid friendship ID
 *       404:
 *         description: Friend request not found
 */
router.patch("/accept/:id", authHelper, async (req: AuthRequest<{ id: string }>, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.userId!;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid friendship ID" });
    }

    const friendship = await prisma.friendship.findUnique({
      where: { id },
    });

    if (!friendship) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    // make sure only the receiver can accept
    if (friendship.receiverId !== userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (friendship.status === FriendshipStatus.accepted) {
      return res.status(400).json({ error: "Already friends" });
    }

    const updated = await prisma.friendship.update({
      where: { id },
      data: { status: FriendshipStatus.accepted },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @swagger
 * /friendships/reject/{id}:
 *   delete:
 *     summary: Reject or remove a friendship
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Friendship removed
 *       400:
 *         description: Invalid friendship ID
 *       404:
 *         description: Friendship not found
 */
router.delete("/reject/:id", authHelper, async (req: AuthRequest<{ id: string }>, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.userId!;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid friendship ID" });
    }

    const friendship = await prisma.friendship.findUnique({
      where: { id },
    });

    if (!friendship) {
      return res.status(404).json({ error: "Friendship not found" });
    }

    // make sure only sender or receiver can delete
    if (friendship.senderId !== userId && friendship.receiverId !== userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await prisma.friendship.delete({ where: { id } });
    res.json({ message: "Friendship removed" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @swagger
 * /friendships/pending/{userId}:
 *   get:
 *     summary: Get pending friend requests for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of pending requests
 *       400:
 *         description: Invalid user ID
 */
router.get("/pending/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const pending = await prisma.friendship.findMany({
      where: {
        receiverId: userId,
        status: FriendshipStatus.pending,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    res.json(pending);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @swagger
 * /friendships/{userId}:
 *   get:
 *     summary: Get all friends of a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of friends
 *       400:
 *         description: Invalid user ID
 */
router.get("/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { senderId: userId, status: FriendshipStatus.accepted },
          { receiverId: userId, status: FriendshipStatus.accepted },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    // return the friend (not the current user)
    const friends = friendships.map((f) => {
      const friend = f.senderId === userId ? f.receiver : f.sender;
      return {
        friendshipId: f.id,
        ...friend,
        isOnline: isUserOnline(friend.id),
      };
    });

    res.json(friends);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
