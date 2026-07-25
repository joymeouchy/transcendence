// GET-> Read/fetch data	(Get user profile)
// POST-> Create new data	(Create a new post)
// PUT-> Replace entire resource	(Replace entire user object)
// PATCH-> Update part of a resource	(Update just the status field)
// DELETE-> Delete data	(Delete a friendship)

import { Router } from "express";
import { PrismaClient, FriendshipStatus } from "../generated/prisma/client";

const router = Router();
const prisma = new PrismaClient();

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
router.post("/send", async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

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
 *       404:
 *         description: Friend request not found
 */
router.patch("/accept/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const friendship = await prisma.friendship.findUnique({
      where: { id },
    });

    if (!friendship) {
      return res.status(404).json({ error: "Friend request not found" });
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
 *       404:
 *         description: Friendship not found
 */
router.delete("/reject/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const friendship = await prisma.friendship.findUnique({
      where: { id },
    });

    if (!friendship) {
      return res.status(404).json({ error: "Friendship not found" });
    }

    await prisma.friendship.delete({
      where: { id },
    });

    res.json({ message: "Friendship removed" });
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
 */
router.get("/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

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
            isOnline: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            isOnline: true,
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
      };
    });

    res.json(friends);
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
 */
router.get("/pending/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

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

export default router;
