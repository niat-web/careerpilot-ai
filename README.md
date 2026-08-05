# CareerPilot AI

Real-time AI interview preparation coach for undergraduate students and entry-level developers.

Built with **React + TypeScript**, **Node.js/Express**, **Supabase** (Auth, PostgreSQL, RLS, Realtime), and the **Gemini API** (`@google/genai`).

## What you get

- Landing, register, login, logout
- Protected dashboard and profile onboarding
- Mock interview setup (role, type, topic, difficulty, question count)
- Gemini-generated questions and answer evaluations
- Final interview report + seven-day study plan
- Interview history and topic progress
- Supabase RLS + backend token/ownership checks
- Realtime interview processing status

## Project structure

```text
careerpilot-ai/
  client/          # Vite + React + Tailwind frontend
  server/          # Express + Gemini + Supabase backend
  supabase/
    migrations/    # SQL schema + RLS policies
  README.md
```

## Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project
- A [Google AI Studio](https://aistudio.google.com/apikey) Gemini API key

## 1. Clone / open the project

```bash
cd Desktop/careerpilot-ai
```

## 2. Install dependencies

```bash
npm run install:all
```

Or separately:

```bash
cd client && npm install
cd ../server && npm install
```

## 3. Supabase setup

1. Create a new Supabase project.
2. Open **SQL Editor**.
3. Paste and run the full contents of:

`supabase/migrations/001_initial_schema.sql`

4. In **Authentication → Providers**, keep Email enabled.
5. In **Database → Replication**, confirm `interview_sessions` is enabled for Realtime (the migration adds it to `supabase_realtime`).
6. Copy these values from **Project Settings → API**:
   - Project URL
   - `anon` public key
   - `service_role` secret key (backend only — never put this in the frontend)

## 4. Gemini API setup

1. Go to [Google AI Studio](https://aistudio.google.com/apikey).
2. Create an API key.
3. Put it only in `server/.env` as `GEMINI_API_KEY`.

## 5. Environment variables

### Frontend — create `client/.env`

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_BASE_URL=http://localhost:5000
```

### Backend — create `server/.env`

```env
PORT=5000
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash
CLIENT_URL=http://localhost:5173
```

Example templates:

- `client/.env.example`
- `server/.env.example`

**Never commit real `.env` files.**

## 6. Run locally

Terminal 1 — backend:

```bash
cd server
npm run dev
```

Terminal 2 — frontend:

```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## 7. Workshop testing checklist

1. Register a student account.
2. Complete onboarding/profile.
3. Open dashboard (should be empty initially).
4. Start a new interview (3 Easy questions).
5. Submit answers and confirm feedback appears.
6. Finish interview and open the final report.
7. Generate a seven-day study plan.
8. Confirm history and dashboard metrics update.
9. Log out and verify dashboard redirects to login.
10. Confirm `expected_points` never appear in browser Network responses for questions.

## API overview

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/profile` | Get profile |
| PUT | `/api/profile` | Update profile |
| GET | `/api/dashboard` | Dashboard stats |
| POST | `/api/interviews/start` | Start interview + first question |
| GET | `/api/interviews` | History |
| GET | `/api/interviews/:id` | Session detail |
| POST | `/api/interviews/:id/question` | Next question |
| POST | `/api/interviews/:id/answer` | Submit + evaluate answer |
| POST | `/api/interviews/:id/complete` | Final report |
| POST | `/api/study-plans` | Generate study plan |
| GET | `/api/study-plans` | List plans |
| GET | `/api/progress` | Topic progress |

All protected routes require `Authorization: Bearer <supabase_access_token>`.

## Security notes

- Gemini key and Supabase service role key stay on the server.
- Frontend only uses the Supabase anon key.
- Zod validates request bodies and AI JSON responses.
- AI endpoints are rate-limited.
- Answer length is capped; duplicate answers are rejected.
- Expected answer points are stored server-side and not returned with questions.
- RLS policies restrict each user to their own rows; backend also checks ownership.

## Production build

```bash
cd client && npm run build
cd ../server && npm run build
```

### Suggested deployment

| Part | Option |
|------|--------|
| Frontend | Vercel / Netlify / Cloudflare Pages |
| Backend | Render / Railway / Fly.io |
| Database/Auth | Supabase |

Set production env vars on each host. Point `CLIENT_URL` to your frontend origin and `VITE_API_BASE_URL` to your backend URL.

## Remaining limitations

- Email confirmation behavior depends on your Supabase Auth settings (disable confirmations for workshops if needed).
- Gemini model availability/quota varies by Google account.
- Realtime requires the migration publication step; if it fails, add `interview_sessions` manually in the Supabase dashboard.
- No admin panel or multi-tenant org support.
- Study plans are regenerated on demand (not auto-scheduled reminders).

## License

MIT — suitable for classroom and workshop use.
