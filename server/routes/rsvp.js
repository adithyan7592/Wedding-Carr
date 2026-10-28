import { Router } from "express";
import Rsvp from "../models/Rsvp.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { name, phone, attending, guests } = req.body;
    if (!name?.trim() || typeof attending !== "boolean") {
      return res.status(400).json({ error: "Name and attendance are required." });
    }
    const rsvp = await Rsvp.create({
      name,
      phone,
      attending,
      guests: attending ? Math.min(Math.max(Number(guests) || 1, 1), 10) : 0,
    });
    res.status(201).json({ ok: true, id: rsvp._id });
  } catch (err) {
    res.status(500).json({ error: "Could not save your RSVP. Try again in a minute." });
  }
});

// Family view: GET /api/rsvp?key=ADMIN_KEY
router.get("/", async (req, res) => {
  if (!process.env.ADMIN_KEY || req.query.key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Not authorised." });
  }
  const list = await Rsvp.find().sort({ createdAt: -1 }).lean();
  const attending = list.filter((r) => r.attending);
  res.json({
    total: list.length,
    attendingCount: attending.reduce((n, r) => n + (r.guests || 1), 0),
    list,
  });
});

export default router;
