import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import rsvpRoutes from "./routes/rsvp.js";
import wishRoutes from "./routes/wishes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(",") || "*" }));
app.use(express.json({ limit: "10kb" }));

const writeLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
app.use("/api/rsvp", (req, res, next) => (req.method === "POST" ? writeLimiter(req, res, next) : next()));
app.use("/api/wishes", (req, res, next) => (req.method === "POST" ? writeLimiter(req, res, next) : next()));

app.use("/api/rsvp", rsvpRoutes);
app.use("/api/wishes", wishRoutes);
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Serve the built React app in production (single Render/Railway service)
const clientDist = path.join(__dirname, "../client/dist");
app.use(express.static(clientDist));
app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(clientDist, "index.html")));

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on :${PORT}`)))
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
