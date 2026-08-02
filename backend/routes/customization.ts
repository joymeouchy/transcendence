import { Router } from "express";
import { authHelper, AuthRequest } from "../src/helpers/auth_helpers";

const router = Router();
import prisma from "../src/prisma";

/**
 * @swagger
 * /customization:
 *   get:
 *     summary: Get all available customization themes
 *     responses:
 *       200:
 *         description: List of all customization themes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   backgroundColor:
 *                     type: string
 *                     nullable: true
 *                   backgroundImageUrl:
 *                     type: string
 *                     nullable: true
 *                   leftPaddleColor:
 *                     type: string
 *                     nullable: true
 *                   leftPaddleImageUrl:
 *                     type: string
 *                     nullable: true
 *                   rightPaddleColor:
 *                     type: string
 *                     nullable: true
 *                   rightPaddleImageUrl:
 *                     type: string
 *                     nullable: true
 *                   ballColor:
 *                     type: string
 *                     nullable: true
 *                   ballImageUrl:
 *                     type: string
 *                     nullable: true
 *                   isDefault:
 *                     type: boolean
 *       500:
 *         description: Server error
 */
router.get("/", async (req, res) => {
  try {
    const themes = await prisma.customization.findMany();
    res.json(themes);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @swagger
 * /customization/me:
 *   get:
 *     summary: Get the current authenticated user's preferred customization theme
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token, e.g. "Bearer <token>"
 *     responses:
 *       200:
 *         description: The user's preferred theme, or the default theme if their preference is unset/unknown
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 backgroundColor:
 *                   type: string
 *                   nullable: true
 *                 backgroundImageUrl:
 *                   type: string
 *                   nullable: true
 *                 leftPaddleColor:
 *                   type: string
 *                   nullable: true
 *                 leftPaddleImageUrl:
 *                   type: string
 *                   nullable: true
 *                 rightPaddleColor:
 *                   type: string
 *                   nullable: true
 *                 rightPaddleImageUrl:
 *                   type: string
 *                   nullable: true
 *                 ballColor:
 *                   type: string
 *                   nullable: true
 *                 ballImageUrl:
 *                   type: string
 *                   nullable: true
 *                 isDefault:
 *                   type: boolean
 *       401:
 *         description: No token provided
 *       404:
 *         description: No theme available (user's preferred theme is unknown and no default theme is configured)
 *       500:
 *         description: Server error
 */
router.get("/me", authHelper, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { preferredTheme: true },
    });

    const theme = await prisma.customization.findUnique({
      where: { name: user?.preferredTheme ?? "classic" },
    });

    // fallback to default if theme not found
    if (!theme) {
      const defaultTheme = await prisma.customization.findFirst({
        where: { isDefault: true },
      });

      if (!defaultTheme) {
        return res.status(404).json({ error: "No theme available" });
      }

      return res.json(defaultTheme);
    }

    res.json(theme);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @swagger
 * /customization/me:
 *   patch:
 *     summary: Update the current authenticated user's preferred theme
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
 *               - themeName
 *             properties:
 *               themeName:
 *                 type: string
 *                 description: Must match an existing customization theme's name
 *                 example: football
 *     responses:
 *       200:
 *         description: Theme updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 theme:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     backgroundColor:
 *                       type: string
 *                       nullable: true
 *                     backgroundImageUrl:
 *                       type: string
 *                       nullable: true
 *                     leftPaddleColor:
 *                       type: string
 *                       nullable: true
 *                     leftPaddleImageUrl:
 *                       type: string
 *                       nullable: true
 *                     rightPaddleColor:
 *                       type: string
 *                       nullable: true
 *                     rightPaddleImageUrl:
 *                       type: string
 *                       nullable: true
 *                     ballColor:
 *                       type: string
 *                       nullable: true
 *                     ballImageUrl:
 *                       type: string
 *                       nullable: true
 *                     isDefault:
 *                       type: boolean
 *       400:
 *         description: Theme name is required
 *       401:
 *         description: No token provided
 *       404:
 *         description: Theme not found
 *       500:
 *         description: Server error
 */
router.patch("/me", authHelper, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { themeName } = req.body;

    if (!themeName) {
      return res.status(400).json({ error: "Theme name is required" });
    }

    // check theme exists
    const theme = await prisma.customization.findUnique({
      where: { name: themeName },
    });

    if (!theme) {
      return res.status(404).json({ error: "Theme not found" });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { preferredTheme: themeName },
    });

    res.json({ message: "Theme updated", theme });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
