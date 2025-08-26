
# Gaza Travel — Before & After (Full Stack Project)

**Stack:** React (Vite) + Node.js/Express + SQLite + REST API

This project presents a tourism & travel portal to Gaza that contrasts experiences **before** and **after** the war.
It includes content sections (places, experiences, tips), a timeline, and an admin seed route to load sample data.

---

## Quick Start

### Requirements
- Node.js 18+ and npm
- (Optional) Git

### 1) Install & Run Backend
```bash
cd server
npm install
npm run dev   # or: npm start
```
- Starts at `http://localhost:4000`
- On first run, a SQLite DB (`database.db`) is created and seeded at `/api/admin/seed` if you open that route once in the browser.

### 2) Install & Run Frontend
```bash
cd ../client
npm install
npm run dev
```
- Vite dev server (default): `http://localhost:5173`

### 3) Configure Frontend API URL (optional)
By default, the frontend expects the API at `http://localhost:4000`. To change this, edit `client/src/config.js`.

---

## Features
- **Era Toggle:** switch between **Before** and **After** to see different places and tips.
- **Interactive Map (Leaflet):** view places on a simple map (static tiles by default; feel free to plug your favorite tile provider).
- **Timeline:** notable dates and events.
- **Media Gallery:** images grouped by era.
- **Admin Seed:** `GET /api/admin/seed` to re-seed demo content.

---

## Folders
```
/client   # React + Vite app
/server   # Express + SQLite REST API
```

---

## Notes
- The included sample data is illustrative only. Please curate/replace with your own vetted information, images, and dates.
- For production, set proper CORS, authentication, error handling, and a persistent DB path.
- Leaflet map uses OpenStreetMap tiles by default.
