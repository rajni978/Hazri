# Decisions and limitations

These are the choices made for Feature 1, and the limits you should not forget while using it.

## Decisions

### Separate client and server

The React app and the Express app have their own `package.json` files. They are not bundled into one Node process. That matches the stack you asked for and makes the HTTP boundary visible while you are learning it.

### JavaScript modules, not TypeScript

Both apps use modern `import` / `export` JavaScript. TypeScript can be added later if you want it. Feature 1 stays on the language you already study in the MERN stack.

### Tailwind v4 through the Vite plugin

Tailwind is a dev dependency of the client, together with `@tailwindcss/vite`. Colours live in `client/src/index.css` under `@theme`, so there is no extra `tailwind.config.js`. The palette is the one approved for Hazri:

| Name | Hex | Use |
|---|---|---|
| Terracotta | `#B9654B` | Mark, emphasis, error text |
| Cream | `#F4EBDD` | Light page background |
| Charcoal | `#292725` | Light text, dark page background |
| Sage | `#A9B5A0` | "Planned" label background |
| Sand | `#D9B88F` | Borders, secondary text on dark backgrounds |

Sage is a fill behind charcoal text. It is not used as small text on cream, because that pair is hard to read.

### Class-based light and dark themes

The theme is a class on `<html>` plus one `localStorage` key. It is not tied to a user account, because accounts do not exist yet. The first visit follows the system preference. After a click, the stored choice wins.

### dotenv, CORS, and Express only

Server runtime dependencies are `express`, `cors`, and `dotenv`.

- `express` is the HTTP server.
- `cors` lets the Vite origin read the health JSON.
- `dotenv` reads `server/.env` when you create one.

`nodemon` is not installed. Node 20's `node --watch` restarts the API during development.

MongoDB, Mongoose, bcrypt, and JWT are not installed. Adding them now would suggest that login exists.

### Health payload says the database is not configured

Returning `"database": "not-configured"` is more honest than returning only `"ok": true`. A later feature should change this field only when a real ping to MongoDB succeeds.

### Git is local

The folder is a Git repository. Nothing has been pushed. GitHub is a later step, when you ask for it.

### No initial commit was created

Git is initialized so `.gitignore` is in force. A commit will be made when you ask for one. Until then, `git status` shows the foundation files as untracked.

## Limitations

- The health route is public. Anyone who can reach the port can call it. That is acceptable because the body reveals only the service name, the fact that the database is absent, and the server clock.
- CORS is not authentication. It only stops other websites from reading the response inside a visitor's browser.
- Theme preference is stored on that browser, not synced anywhere.
- There is no shared 404 JSON yet.
- The React dev server and the API must both be running. Opening `index.html` as a file will not work, because Vite and the API are development servers.
- Google Fonts are loaded from the network. Offline, the page uses the fallback fonts and remains readable.
- Attendance rules from the product brief are not enforced, because there is no attendance data. They are recorded in the project guide so we do not invent a different set of statuses later.
- An OTP, when we build it, will be a short-lived shared code. It reduces casual mistakes. It does not, by itself, prove physical presence or stop someone else in the room from reading the code.

## Security notes for this feature

- Do not commit `server/.env` or `client/.env`. The ignore rules allow only `*.env.example`.
- Do not put passwords in `VITE_` variables. Anything with that prefix is shipped to the browser.
- The server does not log request bodies. The health route has no body.
- Dependencies were installed from the npm registry. Re-run `npm install` inside `client/` and `server/` if you clone this project later. `node_modules` is not part of Git.
