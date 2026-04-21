//Not used yet
import { Router } from "express";
import bcrypt from "bcrypt";

const router = Router();

// TEMP: in-memory users (replace later with DB)
const users: any[] = [];

const SALT_ROUNDS = 12;

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword,
    };

    users.push(newUser);

    res.status(201).json({ message: "User registered" });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      userId: user.id,
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;