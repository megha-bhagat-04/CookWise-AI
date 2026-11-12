# CookWise AI — An AI-Powered Smart Kitchen Assistant

> MCA Major Project · MERN Stack · AI Recipe Generation with Groq (primary) + Google Gemini (fallback)

CookWise AI is a full-stack smart kitchen assistant that helps users track their pantry inventory, monitor expiry dates, reduce food waste, and generate personalized AI-powered recipe recommendations from the ingredients they already own.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Key Features](#2-key-features)
3. [Technology Stack](#3-technology-stack)
4. [Architecture](#4-architecture)
5. [Project Structure](#5-project-structure)
6. [How the Application Works](#6-how-the-application-works)
7. [AI Recipe Generation (Groq + Gemini)](#7-ai-recipe-generation-groq--gemini)
8. [Database Models](#8-database-models)
9. [API Reference](#9-api-reference)
10. [Expiry Date Handling](#10-expiry-date-handling)
11. [Theme System](#11-theme-system)
12. [Environment Variables](#12-environment-variables)
13. [Installation & Running](#13-installation--running)
14. [Security Measures](#14-security-measures)
15. [Development History](#15-development-history)
16. [Known Limitations & Future Scope](#16-known-limitations--future-scope)

---

## 1. Project Overview

CookWise AI solves a common household problem: **food waste due to forgotten or expired pantry items**. The application lets a user:

- Build and maintain a digital pantry (add, edit, delete ingredients with quantity, unit, category and expiry date).
- See at a glance what is fresh, expiring soon, or already expired.
- Receive smart kitchen insights computed from their real inventory.
- Generate **3 personalized recipes** using AI that prioritize ingredients closest to expiry — so nothing gets thrown away.
- Add missing ingredients from those recipes directly to a persistent grocery list.

The AI layer uses **Groq** (fast, primary provider) and automatically falls back to **Google Gemini** if Groq is unavailable — ensuring the feature keeps working.

---

## 2. Key Features

### Authentication
- User registration and login (email + password, min 8 characters)
- JWT-based authentication (30-day expiry by default)
- Protected routes — logged-out users are redirected to `/login`
- Public-only routes — logged-in users visiting `/`, `/login` or `/register` are redirected to `/dashboard`
- Session persistence across refreshes (token + user cached in `localStorage`, validated via `/api/auth/me` on load)
- Logout clears auth state and returns to the Landing Page

### Dashboard
- Personalized welcome greeting ("Welcome back, {name}")
- Hero section with quick actions (Manage Pantry / Generate AI Recipes)
- Four live inventory statistics (Total Items, Fresh, Expiring Soon, Expired) from the real API
- Expiry alerts for items expiring within 3 days (names + dates + "View Pantry")
- Pantry insights generated from actual inventory data
- Quick access cards (AI Recipes, Grocery List)
- Recent pantry activity (latest added ingredients)

### Pantry Management
- Full CRUD on ingredients (name, category, quantity, unit, purchase date, expiry date, optional image URL)
- Live search, category filtering and sorting (name, expiry, quantity, recently added)
- Expiry tracking with color-coded status badges (Fresh / Expiring Soon / Expired)
- **Expiry reminders**: items expiring today or within 1 day are highlighted in a dedicated amber section
- Pantry insights API (category counts, expiring-soon counts, freshness percentage)
- Grouped unit dropdown: Weight (g, kg, mg), Volume (ml, L, cup, tbsp, tsp), Count (pcs, dozen, pack, packet), Packaging (bottle, jar, can, box, bunch) — with backward compatibility for custom units
- Native calendar date pickers for purchase and expiry dates

### AI Recipes
- Generates exactly **3 recipes** from the user's real pantry
- Prioritizes ingredients that are expiring soonest
- Each recipe includes: name, description, ingredients with quantities, missing ingredients, cooking time, difficulty, step-by-step instructions, nutrition estimates (calories/protein/carbs/fat) and a recommendation reason
- Respects dietary preference and cooking-time filters
- Missing ingredients can be pushed to the Grocery List with one click
- Graceful fallback: Groq → Gemini → smart heuristic pantry recipes (so the page never breaks)

### Grocery List
- Add custom grocery items (name + quantity)
- Mark items as purchased / un-purchased
- Delete items
- Pending and purchased items displayed separately
- All data persisted in MongoDB and scoped to the authenticated user

### UI / UX
- Light, warm cream-and-sage themed design (light mode is the only theme)
- Fully responsive (desktop / tablet / mobile) with a collapsible mobile navbar
- Loading skeletons, empty states, toast notifications and inline error messages throughout

---

## Folder Structure

```
CookWise-AI
│
├── client
│   ├── public
│   └── src
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   └── server.js
│
└── README.md
```


---

## 7. AI Recipe Generation (Groq + Gemini)

### Provider orchestration (`server/services/recipeAIService.js`)

| Order | Provider | Model | Timeout | Notes |
|---|---|---|---|---|
| 1 (primary) | Groq | `openai/gpt-oss-20b` | 25 s | `groq-sdk` (OpenAI-compatible), `response_format: json_object`, `reasoning_effort: low`, `max_tokens: 4096` |
| 2 (fallback) | Google Gemini | `gemini-3.8-flash` | 30 s | `@google/genai`, JSON response mode; 1 retry on transient 429/503 (never repeated) |
| 3 (safety net) | Heuristic recipes | — | instant | Built from pantry names so the page never breaks; clearly labeled |

**Fallback triggers:** timeout, rate limit (429), service unavailability (5xx/UNAVAILABLE), malformed JSON, auth failure. Validation errors from the user's input never trigger fallback.

### Recipe output contract (unchanged for frontend compatibility)

```jsonc
{
  "success": true,
  "count": 3,
  "isFallback": false,          // true when Gemini served the response
  "provider": "groq",           // optional metadata (frontend ignores it)
  "model": "openai/gpt-oss-20b",
  "data": [
    {
      "name": "Spinach Tomato Egg Scramble",
      "description": "A quick, protein-rich breakfast…",
      "ingredients": ["6 Eggs", "250 g Spinach", "3 medium Tomatoes"],
      "missingIngredients": [],
      "cookingTime": "15 min",
      "difficulty": "Easy",
      "instructions": ["Beat eggs…", "Heat oil…", "…"],
      "nutrition": { "calories": "320 kcal", "protein": "21g", "carbs": "9g", "fat": "22g" },
      "recommendationReason": "Uses spinach and tomatoes expiring today…"
    }
  ]
}
```

Both providers' responses are **normalized** before returning: exactly 3 recipes, all list fields coerced to plain strings, nutrition values to strings. This prevents provider-format differences (e.g. Groq returning `{"item","quantity"}` objects) from breaking the React rendering.

### Why two providers?

During development the Gemini endpoint intermittently returned `503 UNAVAILABLE ("This model is currently experiencing high demand")` and quota errors. Groq was added as the fast primary (~1–3 s typical) so generation stays reliable; Gemini remains as a configured fallback.

---

## 8. Database Models

### User (`users`)

| Field | Type | Rules |
|---|---|---|
| `name` | String | required, ≤ 50 chars |
| `email` | String | required, unique, lowercase, regex-validated |
| `password` | String | required, ≥ 8 chars, bcrypt-hashed, `select: false` |
| `avatar` | String | optional, default `""` |
| `createdAt/updatedAt` | Date | timestamps |

### PantryItem (`pantryitems`)

| Field | Type | Rules |
|---|---|---|
| `userId` | ObjectId → User | required, indexed (every query is user-scoped) |
| `name` | String | required, ≤ 100 chars |
| `category` | String | required; one of: Vegetables, Fruits, Dairy, Grains, Spices, Meat, Drinks, Others |
| `quantity` | Number | required, ≥ 0 |
| `unit` | String | required (grouped units + custom values supported) |
| `expiryDate` | Date | required — stored calendar-safe (see §10) |
| `purchaseDate` | Date | default `Date.now` |
| `image` | String | optional image URL |
| `createdAt/updatedAt` | Date | timestamps |

### GroceryItem (`groceryitems`)

| Field | Type | Rules |
|---|---|---|
| `userId` | ObjectId → User | required, indexed |
| `name` | String | required, ≤ 100 chars |
| `quantity` | String | optional free-text (e.g. "2", "1 pack") |
| `category` | String | default `"Others"` |
| `isPurchased` | Boolean | default `false` |
| `createdAt/updatedAt` | Date | timestamps |

---

## 9. API Reference

Base URL: `http://localhost:5001/api` (Vite dev server proxies `/api` → port 5001).

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Create account (`name`, `email`, `password`, `confirmPassword?`) → returns user + JWT |
| POST | `/auth/login` | Public | Login (`email`, `password`) → returns user + JWT |
| POST | `/auth/logout` | Public | Stateless logout (client clears storage) |
| GET | `/auth/me` | Bearer | Current user profile (used to restore sessions) |

### Pantry

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/pantry` | Bearer | List user's pantry items |
| POST | `/pantry` | Bearer | Add item (name, category, quantity, unit, expiryDate required; purchaseDate/image optional) |
| PUT | `/pantry/:id` | Bearer | Update item (owner-checked) |
| DELETE | `/pantry/:id` | Bearer | Delete item (owner-checked) |
| GET | `/pantry/stats` | Bearer | `{ totalItems, freshItems, expiringSoon, expiredItems, categoriesUsed }` |
| GET | `/pantry/expiry-reminders` | Bearer | Items expiring today or in ≤ 1 day (sorted by expiry) |
| GET | `/pantry/insights` | Bearer | Text insights computed from real inventory |

### Recipes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/recipes/generate` | Bearer | Generate 3 AI recipes. Body: `{ dietaryPreferences?, preferredCookingTime? }` → `{ success, count, isFallback, provider?, model?, data[], fallbackNotice? }` |

### Grocery

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/grocery` | Bearer | List user's grocery items (pending first) |
| POST | `/grocery` | Bearer | Add item (`name` required; `quantity`, `category` optional) |
| PUT | `/grocery/:id/toggle` | Bearer | Toggle purchased flag (owner-checked) |
| DELETE | `/grocery/:id` | Bearer | Delete item (owner-checked) |

---

## 10. Expiry Date Handling

Expiry dates are **calendar dates, not timestamps**. A naive `new Date("2026-11-20")` is parsed as UTC midnight, which shifts by one day in timezones behind UTC — the classic "off-by-one expiry" bug.

The project avoids this with a consistent strategy on both sides:

1. **Storage (`server/controllers/pantryController.js`)** — every incoming date string `YYYY-MM-DD` is parsed by `parseDateOnly()` into a **local-noon `Date`** before saving. Noon avoids both UTC-midnight shifts and DST edge cases, and stays compatible with existing MongoDB records.
2. **Serialization** — dates are returned as ISO strings; the client only ever reads the leading `YYYY-MM-DD` calendar portion.
3. **Client parsing (`client/src/utils/dateUtils.js`)** — `toLocalDate()` converts a `YYYY-MM-DD` prefix to a **local calendar date**; status (`Fresh / Expiring Soon / Expires Today / Expired`) uses `date-fns` `differenceInDays` on `startOfDay` values, i.e. pure calendar-day arithmetic.
4. **Display** — `formatDisplayDate()` → `20 November 2026`; form inputs use `formatDateForInput()` → `2026-11-20` for `<input type="date">`.
5. **Edit safety** — `PantryFormModal` keeps the exact saved calendar date when the user does not change it, so editing other fields never shifts the expiry date.

Both `server/utils/dateUtils.js` and `client/src/utils/dateUtils.js` mirror the same logic.

---

## 11. Theme System

- The UI is **light-only**: `ThemeContext` forces `light`, removes any `dark` class, and sets `color-scheme: light`. The toggle button and all `dark:` utility classes were removed during development.
- Palette (see `client/src/styles/index.css`): warm cream background (`#f8f6ef` with subtle sage/emerald radial gradients), white glass cards, forest-green (`#2d5a43`) headings, emerald (`#10b981`) accents, soft shadows and borders.

---

## 12. Environment Variables

`server/.env` (git-ignored — never commit):

```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/cookwise_ai
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
```

Frontend (`client/.env`, optional): `VITE_API_URL` (defaults to `/api`, proxied by Vite).

Get keys from: <https://console.groq.com/keys> (Groq) and <https://aistudio.google.com/app/apikey> (Gemini).

---

## 13. Installation & Running

**Prerequisites:** Node.js 18+, MongoDB running locally on `27017`.

```bash
# 1. Install backend dependencies
cd server
npm install

# 2. Configure environment
cp .env.example .env        # then fill in the real values

# 3. Install frontend dependencies
cd ../client
npm install

# 4. Start backend (terminal 1)
cd server
npm run dev                 # nodemon, port 5001

# 5. Start frontend (terminal 2)
cd client
npm run dev                 # Vite, http://localhost:5173
```

Open **http://localhost:5173**, register an account, add pantry items, then try **AI Recipes**.

### npm scripts

| Location | Script | Purpose |
|---|---|---|
| `client` | `npm run dev` | Vite dev server (port 5173) |
| `client` | `npm run build` | Production build → `dist/` |
| `client` | `npm run preview` | Preview the production build |
| `client` | `npm run lint` | oxlint |
| `server` | `npm run dev` | nodemon (auto-restart) |
| `server` | `npm start` | plain node |

### Build / syntax verification

```bash
cd client && npm run build                       # frontend production build
cd server && node --check server.js              # backend syntax checks
```

---

## 14. Security Measures

- **Passwords**: bcrypt-hashed (10 salt rounds) via a Mongoose pre-save hook; `password` is `select: false` and never returned by any endpoint.
- **JWT**: signed with `JWT_SECRET`, expiry from `JWT_EXPIRE`; verified by `protect` middleware on every private route.
- **Secrets**: `GROQ_API_KEY` / `GEMINI_API_KEY` are read only inside the backend (`process.env`); they are never bundled into the React app.
- **`.gitignore`** covers `.env` (except `.env.example`), `node_modules`, `dist/`, `build/`, logs and OS files.
- **User scoping**: every pantry/grocery query filters by `req.user._id`, and update/delete/toggle handlers verify ownership (401 otherwise).
- **Input validation**: server-side checks for required fields, types, lengths and enums; client-side validation mirrors them.
- **Error handling**: central error middleware returns clean JSON (no stack traces in production); AI errors are sanitized so raw provider payloads never reach the user.
- **Axios interceptor**: a 401 response clears the stored session and redirects to `/login?expired=1`.

---

## 15. Development History

Key issues solved during development (in order):

1. **Expiry date off-by-one bug** — root-caused to UTC-midnight parsing; fixed with the calendar-safe strategy described in §10 (server + client date utils, controller normalization, edit-preservation in the form).
2. **Dark theme as default** — made light the only theme; removed the toggle, stripped `dark:` classes and legacy template CSS; polished the light palette.
3. **Empty dashboard** — rebuilt with live API data: welcome, hero, 4 stats, expiry alerts, insights, quick access, recent activity.
4. **"Low Stock" section replaced by expiry reminders** — new `/api/pantry/expiry-reminders` endpoint listing items expiring today or within 1 day.
5. **Calendar date pickers** — date inputs open the native picker on click (`showPicker()`), light color-scheme styling.
6. **Slow recipe generation** — timing logs added, prompt compacted, token limits tuned, single lean DB query (`.select().lean()`), 45 s client timeout, duplicate-click guard, clear loading message.
7. **Provider reliability** — Groq integrated as primary (Groq→Gemini→heuristic fallback chain, per-provider timeouts, no repeated retries).
8. **Blank screen on Generate Recipes** — Groq returned `ingredients` as objects which React cannot render; fixed by normalizing all list fields to strings in `groqService.js` and adding defensive rendering in `RecipesPage.jsx`.

Each fix kept the existing response formats and features intact so the frontend never needed a rewrite.

---

## 16. Known Limitations & Future Scope

**Known limitations**
- Gemini (`gemini-3.8-flash`) intermittently returns `503 UNAVAILABLE` / quota errors; Groq carries generation, but both providers can be down simultaneously (then smart fallback recipes are shown).
- Groq free-tier has per-minute/day rate limits; rapid repeated generation can hit `429`.
- This is a local-development project (no deployment config for Render/Vercel etc.).
- No automated test suite yet (verification is via builds, syntax checks and live API tests).
- `utils/stockUtils.js` (low-stock thresholds) exists but is currently unused by the UI.
- Grocery `quantity` is free text (not structured).

**Future scope**
- Add structured grocery quantities/units and pantry→grocery auto-suggest from low stock.
- Deploy frontend (Vercel/Netlify) and backend (Render/Railway) with production env vars.
- Add recipe saving/favorites and a proper test suite (Jest/Supertest + RTL).
- Per-user low-stock thresholds and expiry-notification emails.