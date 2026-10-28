import { Router } from "express";
import Wish from "../models/Wish.js";

const router = Router();

router.get("/", async (_req, res) => {
  const wishes = await Wish.find().sort({ createdAt: -1 }).limit(50).lean();
  res.json(wishes);
});

router.post("/", async (req, res) => {
  try {
    const { name, message } = req.body;
    if (!name?.trim() || !message?.trim()) {
      return res.status(400).json({ error: "Add your name and a message." });
    }
    const wish = await Wish.create({ name, message });
    res.status(201).json(wish);
  } catch {
    res.status(500).json({ error: "Could not post your wish. Try again in a minute." });
  }
});

export default router;
