# Hackathon — Cursor KT Document

guide for building and deploying a full-stack app with **Cursor**, using **GitHub**, **Vercel**, **Render**, and **Supabase**.

---

## 1. Create accounts before you start

Complete these **before** opening Cursor or pasting any master prompt.

### 1.1 GitHub
- If you **do not** have an account → create one at [https://github.com](https://github.com)
- If you **already** have an account → use that account
- Sign in and keep the browser session ready

### 1.2 Vercel (frontend hosting)
- If you **do not** have an account → create one at [https://vercel.com](https://vercel.com) (sign up with GitHub is recommended)
- If you **already** have an account → use that account
- Connect / authorize GitHub when Vercel asks

### 1.3 Render (backend hosting)
- If you **do not** have an account → create one at [https://render.com](https://render.com)
- If you **already** have an account → use that account
- Connect GitHub when Render asks (needed for auto-deploy from repo)

### 1.4 Supabase (database + authentication)
- If you **do not** have an account → create one at [https://supabase.com](https://supabase.com)
- If you **already** have an account → use that account
- You should be able to create a new project later during deployment

### Checklist before Cursor
- [ ] GitHub ready  
- [ ] Vercel ready  
- [ ] Render ready  
- [ ] Supabase ready  

---

## 2. Create / open a Cursor account

1. Download Cursor from [https://cursor.com](https://cursor.com)
2. Install and open Cursor
3. Sign up / log in with your email or GitHub
4. Open (or create) your project folder in Cursor  
   Example: `Desktop/your-project-name`

---

## 3. Models available in Cursor

In the chat / agent model dropdown you may see options such as:

| Model | Notes |
|--------|--------|
| **Cursor Grok 4.5 Medium** | Good default for full-stack build + deploy flows |
| **Composer 2.5** | Alternative model option in Cursor |

Select a model before starting the master prompt (recommended: **Cursor Grok 4.5 Medium**).

---

## 4. Connect your GitHub account in Cursor

1. Open Cursor **Settings**
2. Go to **Git & PRs** / account connections (or complete GitHub login when Cursor prompts)
3. Sign in with the **same GitHub account** you created/used in Section 1
4. Approve access so Cursor can create repos, commit, and push

**Why:** The second prompt will commit & push code to GitHub automatically.

---

## 5. Install required plugins in Cursor

Open **Settings → Plugins** and install / enable these three:

### 5.1 Vercel plugin
**Use case:** Deploy the **frontend** (React / Vite / Next.js static or web app) to Vercel production.  
Also used for linking the project and setting frontend environment variables.

### 5.2 Render plugin
**Use case:** Deploy the **backend** (Node / Express API) as a web service on Render.  
Also used for backend env vars, build/start commands, and deploy status.

### 5.3 Supabase plugin
**Use case:** Create/link a **Supabase project**, run SQL migrations, configure **PostgreSQL + Auth + RLS**, and fetch project URL / anon keys for the app.

Make sure all three show as installed for your project before continuing.

---

## 6. Build the application (Master Prompt)

1. Open a **new Agent / Chat** in Cursor
2. Select your model (e.g. Cursor Grok 4.5 Medium)
3. Copy and paste your **Master Prompt** into the chat
4. Let Cursor build the full application (frontend + backend + database schema, etc.)
5. Do **not** start deployment until the build looks complete

### Master prompt

```text
Master prompt text
```

> Teams: replace the line above with your own full product/build master prompt (features, pages, APIs, schema, tech stack).

---

## 7. Run locally + commit + deploy (Second Prompt)

After the application is built:

1. Open the **same project** in Cursor
2. Paste the **Second Prompt** below
3. When Cursor asks for **access / login / approval** for:
   - Supabase  
   - Render  
   - Vercel  
   → **Approve / Allow** each permission  
4. Provide any secrets Cursor asks for (example: Gemini API key), if your app needs AI
5. Wait until Cursor finishes local verification + GitHub push + deploys
6. Collect the final links Cursor reports

### Second prompt (copy-paste this)

```text
You are a senior full-stack engineer and DevOps engineer.

The application already exists in this repository (frontend in `client/`, backend in `server/`, Supabase migrations in `supabase/` — or equivalent folders).

Your task is NOT to rebuild the app.
Your task is to run it locally end-to-end and deploy it to production.

## Goal

1. Configure environment variables
2. Set up Supabase (project + migration + auth)
3. Run frontend and backend locally and verify they work
4. Commit and push to a new GitHub repository if needed
5. Deploy backend to Render
6. Deploy frontend to Vercel
7. Wire production URLs together
8. Report final working URLs

Do not stop after scaffolding.
Do not claim completion until local + production are verified.

---

## Before starting

1. Inspect the repository structure.
2. Confirm frontend, backend, and Supabase migration files exist.
3. Check whether `.env` files already exist.
4. Check GitHub auth (`gh auth status`).
5. Check whether Supabase / Render / Vercel plugins or CLIs are authenticated.
6. Tell the user clearly what secrets/approvals are still needed from them BEFORE continuing.

Required from user if missing:
- AI API key (if the app uses Gemini/OpenAI/etc.)
- Preferred GitHub account (if multiple)
- Approval to authenticate Supabase / Render / Vercel plugins or CLIs

Never commit real `.env` files or secrets.

---

## Phase 1 — Supabase setup

1. Authenticate Supabase MCP/plugin if needed.
2. Create a new Supabase project for this app (or use an existing dedicated one only if the user confirms).
3. Apply the SQL migration from `supabase/migrations/` (or equivalent).
4. Verify tables exist with RLS enabled.
5. Fetch Project URL and anon/public key.
6. If service role key is unavailable via MCP, adapt backend to use authenticated user JWT + anon key with RLS, OR ask the user for the service role key.
7. Configure Auth for workshop use:
   - Disable email confirmation (or instruct user how)
   - Set Site URL and Redirect URLs for localhost and production frontend

---

## Phase 2 — Local environment files

Create local env files (do not commit them).

Frontend example:
- `VITE_SUPABASE_URL=`
- `VITE_SUPABASE_ANON_KEY=`
- `VITE_API_BASE_URL=http://localhost:5000`

Backend example:
- `PORT=5000`
- `SUPABASE_URL=`
- `SUPABASE_ANON_KEY=`
- `SUPABASE_SERVICE_ROLE_KEY=`
- `GEMINI_API_KEY=` (or other AI key)
- `CLIENT_URL=http://localhost:5173`

Ensure:
- AI keys stay only on backend
- Service role key (if used) stays only on backend
- Frontend never receives secret keys

---

## Phase 3 — Run locally

1. Install dependencies for client and server if needed.
2. Start backend and frontend.
3. Verify backend health endpoint and frontend loads.
4. Fix any startup/type/build errors before deploying.
5. Backend must bind to `0.0.0.0:$PORT` for Render compatibility.

---

## Phase 4 — GitHub

1. Ensure `.gitignore` excludes `.env`, `node_modules`, `dist`.
2. If no remote exists, create a new public GitHub repo.
3. Commit only source/docs (no secrets).
4. Push to GitHub.
5. If push fails due to wrong GitHub account credentials, switch to the correct account/token and retry.
6. Return the GitHub repo URL.

---

## Phase 5 — Deploy backend to Render

1. Authenticate Render MCP/plugin if needed (user must approve access).
2. Create a free Node web service from the GitHub repo.
3. Suggested settings:
   - Build: `npm install --prefix server && npm run build --prefix server`
   - Start: `npm start --prefix server`
4. Set Render env vars (Supabase, AI key, `CLIENT_URL`, etc.).
5. Wait until deploy is live.
6. Verify backend health URL.
7. Note: free Render services may cold-start slowly.

---

## Phase 6 — Deploy frontend to Vercel

1. Authenticate Vercel CLI/plugin if needed (user must approve access).
2. Deploy the frontend app (e.g. `client/`).
3. Ensure SPA rewrites exist if using React Router.
4. Set production env vars (must exist at build time for Vite):
   - Supabase URL
   - Supabase anon key
   - API base URL = Render backend URL
5. Redeploy after adding env vars so they are baked into the build.
6. Verify frontend production URL loads.

---

## Phase 7 — Connect production pieces

1. Update Render `CLIENT_URL` to the Vercel frontend URL.
2. Update Supabase Auth Site URL / Redirect URLs for localhost + Vercel.
3. Confirm CORS allows the Vercel origin.
4. Re-check frontend → backend → auth flow.

---

## Acceptance criteria

Complete only if:

1. App runs locally (frontend + backend)
2. Supabase migration applied successfully
3. Code is on GitHub
4. Backend is live on Render
5. Frontend is live on Vercel
6. Frontend production env points to Render API
7. No secrets committed to GitHub
8. Final URLs are reported clearly

---

## Final response format

After finishing, report:

1. What was configured
2. Local URLs
3. GitHub repo URL
4. Supabase project name/ref
5. Render backend URL
6. Vercel frontend URL
7. Any remaining manual steps for the user (especially Auth email confirmation / redirect URLs)
8. Known limitations (Render cold start, AI quota, etc.)

Now execute this deployment workflow.
```

### Important during Second Prompt
- Cursor will ask permission to connect **Supabase**, **Render**, and **Vercel** → approve each time
- Do not close the chat while deploy is running
- Free Render apps may take 30–60 seconds to wake on first request

---

## 8. Expected final links (after Second Prompt)

Cursor should return links like:

| Item | Example |
|------|---------|
| GitHub repo | `https://github.com/<your-org>/<repo-name>` |
| Frontend (Vercel) | `https://<app-name>.vercel.app` |
| Backend (Render) | `https://<service-name>.onrender.com` |
| Supabase project | Dashboard project URL / project ref |

Also keep:
- Local frontend (example): `http://localhost:5173`
- Local backend (example): `http://localhost:5000`

---

## 9. Quick team workflow (summary)

1. Create GitHub + Vercel + Render + Supabase accounts  
2. Install Cursor + choose model  
3. Connect GitHub in Cursor  
4. Install plugins: Vercel, Render, Supabase  
5. Paste **Master Prompt** → build full app  
6. Paste **Second Prompt** → approve plugin logins → local run + commit/push + deploy  
7. Share final GitHub / Vercel / Render / Supabase links with the team  

---

## 10. Sharing note (hackathon)

- One Cursor account can typically be shared carefully across **2–3 teams** if needed
- Do **not** share production secret keys in WhatsApp / public chats
- Prefer each team using their own Supabase project when possible

---

**Document owner:** Hackathon tooling KT  
**Stack focus:** Cursor → GitHub → Supabase → Render (API) → Vercel (UI)
