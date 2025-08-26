
import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "database.db");
const db = new sqlite3.Database(dbPath);

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS places (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    era TEXT CHECK(era IN ('before','after')) NOT NULL,
    description TEXT,
    latitude REAL,
    longitude REAL,
    image TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS tips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    era TEXT CHECK(era IN ('before','after')) NOT NULL,
    title TEXT,
    content TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS timeline (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    title TEXT,
    description TEXT
  )`);
});

// Simple health
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// Seed route
app.get("/api/admin/seed", (req, res) => {
  db.serialize(() => {
    db.run("DELETE FROM places");
    db.run("DELETE FROM tips");
    db.run("DELETE FROM timeline");

    const places = [
      // BEFORE
      { name: "Old City Market", era: "before", description: "Historic souk with local crafts and spices.", latitude: 31.501, longitude: 34.467, image: "/images/before-market.jpg" },
      { name: "Mediterranean Corniche", era: "before", description: "Seaside promenade with cafés and family spots.", latitude: 31.529, longitude: 34.459, image: "/images/before-corniche.jpg" },
      // AFTER
      { name: "Reconstruction Sites", era: "after", description: "Documenting rebuilding efforts and community resilience.", latitude: 31.520, longitude: 34.470, image: "/images/after-rebuild.jpg" },
      { name: "Community Centers", era: "after", description: "Spaces for aid distribution and local initiatives.", latitude: 31.515, longitude: 34.450, image: "/images/after-community.jpg" },
    ];
    const tips = [
      { era: "before", title: "Local Etiquette", content: "Dress modestly and greet shop owners politely." },
      { era: "before", title: "Best Time", content: "Evenings by the coast were popular for strolling." },
      { era: "after",  title: "Safety & Access", content: "Travel may be severely restricted; always verify permissions, security guidance, and humanitarian advisories." },
      { era: "after",  title: "Responsible Tourism", content: "Support local livelihoods respectfully; prioritize community needs." },
    ];
    const timeline = [
      { date: "2010-06-01", title: "Tourism Initiatives", description: "Local initiatives to promote cultural heritage and coastal attractions." },
      { date: "2023-10-07", title: "War Onset", description: "Escalation that dramatically altered access, safety, and infrastructure." },
      { date: "2024-11-01", title: "Early Reconstruction", description: "Initial community efforts and limited rebuilding activities." }
    ];

    const insertPlace = db.prepare("INSERT INTO places (name, era, description, latitude, longitude, image) VALUES (?,?,?,?,?,?)");
    places.forEach(p => insertPlace.run([p.name, p.era, p.description, p.latitude, p.longitude, p.image]));
    insertPlace.finalize();

    const insertTip = db.prepare("INSERT INTO tips (era, title, content) VALUES (?,?,?)");
    tips.forEach(t => insertTip.run([t.era, t.title, t.content]));
    insertTip.finalize();

    const insertTimeline = db.prepare("INSERT INTO timeline (date, title, description) VALUES (?,?,?)");
    timeline.forEach(t => insertTimeline.run([t.date, t.title, t.description]));
    insertTimeline.finalize();

    res.json({ ok: true, seeded: { places: places.length, tips: tips.length, timeline: timeline.length } });
  });
});

// REST: places
app.get("/api/places", (req, res) => {
  const { era } = req.query;
  const query = era ? "SELECT * FROM places WHERE era = ?" : "SELECT * FROM places";
  const params = era ? [era] : [];
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// REST: tips
app.get("/api/tips", (req, res) => {
  const { era } = req.query;
  const query = era ? "SELECT * FROM tips WHERE era = ?" : "SELECT * FROM tips";
  const params = era ? [era] : [];
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// REST: timeline
app.get("/api/timeline", (req, res) => {
  db.all("SELECT * FROM timeline ORDER BY date ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Static image fallback (place example images into /server/public/images/...)
app.use("/images", express.static(path.join(__dirname, "public", "images")));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("API running on http://localhost:" + PORT);
});
