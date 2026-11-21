# Hazri project guide

Hazri means attendance. The product goal is a transparent record for each class session: who checked in, who is still unconfirmed, and who a mentor later marked present, late, absent, excused, or disputed.

You are building this one feature at a time. This document describes the project as it exists after Feature 1.

## What exists now

- A React app in `client/`, started with Vite.
- An Express app in `server/`.
- Tailwind CSS, with the Hazri colours and a light/dark theme.
- One API route: `GET /api/health`.
- Git in the project folder, with a `.gitignore` that keeps `.env` files out of the repository.
- These six documents in `docs/`.

## What does not exist yet

- User accounts, passwords, or JWT login
- MongoDB connection or Mongoose models
- Classes, subjects, enrollments, sessions, OTPs, or attendance rows
- A GitHub remote

Do not treat the home page as a working attendance system. The three role cards are labels for later work. They are marked **Planned**.

## How to run Feature 1

From the project root, `Documents/Hazri`:

Terminal 1 — API:

```bash
cd server
npm install
npm run dev
```

Expected terminal line:

```text
Hazri API listening on http://localhost:5000
```

Terminal 2 — website:

```bash
cd client
npm install
npm run dev
```

Expected: Vite prints a local URL, normally `http://localhost:5173/`.

Leave both terminals open. `npm run dev` in the server uses Node's built-in `--watch`, so saving a server file restarts the API. Vite reloads the page when you save a client file.

## How to test Feature 1

1. Open the Vite URL in a browser.
2. You should see the name Hazri, the tagline "Every presence matters.", three planned roles, and an API status panel.
3. The status panel should show service `hazri-api`, database `not-configured`, and a server time.
4. Click **Use dark theme**. The page background becomes charcoal and the text becomes cream. Click **Use light theme** to reverse it.
5. Refresh the page. The theme you chose should still be selected.
6. In a third terminal, run:

```bash
curl http://localhost:5000/api/health
```

Expected JSON, with a different time:

```json
{
  "ok": true,
  "service": "hazri-api",
  "database": "not-configured",
  "time": "2026-11-21T13:00:00.000Z"
}
```

7. Stop the server (Ctrl+C in terminal 1) and refresh the website. The status panel should say the API is not reachable. Start the server again and refresh. The panel should recover.

## If something fails

| What you see | What it usually means |
|---|---|
| `EADDRINUSE` when starting the server | Port 5000 is already taken. Stop the other program, or set `PORT` in `server/.env`. |
| The page loads, but the API status is an error | The server is not running, or it is not on `http://localhost:5000`. |
| `curl` works, but the browser does not | The page was opened from a different origin than `http://localhost:5173`, so CORS refused the call. |
| Styles look unstyled | Dependencies were not installed. Run `npm install` inside `client/`. |
| Theme flashes the wrong colours, then corrects | The small script in `client/index.html` should prevent this. If it still happens, say so before we build the next feature. |

## How we will keep building

The next feature is not started until you say you have tested and understood this one. The planned order is:

1. Project foundation (this feature)
2. Database connection and the User model
3. Register, log in, and role protection
4. Admin setup for classes, subjects, and enrollments
5. Student view of class and subjects
6. Mentor attendance sessions
7. Short-lived OTPs
8. Student check-in
9. Mentor roster, corrections, and final review
10. History and discrepancy reports
11. CSV export and admin summaries

Attendance statuses, once they exist, will be `UNCONFIRMED`, `PRESENT`, `PRESENT_LATE`, `ABSENT`, `EXCUSED`, and `DISPUTED`. A student will not be able to edit those values directly.
