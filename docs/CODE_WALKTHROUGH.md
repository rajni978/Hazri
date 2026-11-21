# Code walkthrough — Feature 1

Read these files in the order below. Each one has a single job.

## 1. `client/index.html`

This is the HTML page the browser loads first. React has not started yet.

Three things in the head matter:

- The title is **Hazri**.
- Google Fonts loads Fraunces for headings and Source Sans 3 for body text. If those fonts cannot load, the CSS falls back to Palatino and Segoe UI.
- A short script runs before React. It reads `hazri-theme` from `localStorage`. If you have never chosen a theme, it follows the operating system's light or dark setting. It adds the class `dark` to `<html>` when needed. Doing this before paint avoids a flash of the wrong colours.

The `<div id="root">` is the empty box React fills. The module script at the bottom loads `src/main.jsx`.

## 2. `client/src/main.jsx`

This file starts React. `createRoot` finds `#root`, and `StrictMode` renders `<App />` twice in development so unsafe side effects are easier to notice. That is a React development behaviour, not a Hazri bug. The health request can therefore appear twice in the browser's network panel while `npm run dev` is running. A production build renders once.

## 3. `client/src/index.css`

`@import "tailwindcss"` turns on Tailwind. The Vite plugin in `vite.config.js` processes this file.

`@theme` registers the project colours and fonts as Tailwind utilities. After this, classes such as `bg-cream`, `text-charcoal`, `border-sand`, `bg-terracotta`, `font-display`, and `font-sans` exist.

`@custom-variant dark` tells Tailwind that `dark:` classes apply when an ancestor has the class `dark`.

`body` sets the page background and text colour. `.surface` is a short colour transition used on the header, cards, and theme button.

## 4. `client/vite.config.js`

Vite's config file. Two plugins are registered:

- `@vitejs/plugin-react` compiles JSX.
- `@tailwindcss/vite` compiles Tailwind from `index.css`.

There is no custom proxy yet. The React app calls the API by its full URL, `http://localhost:5000`.

## 5. `client/src/App.jsx`

This is the whole visible page.

`API_URL` is `import.meta.env.VITE_API_URL` if you create `client/.env`, otherwise `http://localhost:5000`. Only variables whose names start with `VITE_` are visible to the browser. Do not put secrets in them.

`roles` is a plain array. Mapping over it draws the three cards. Nothing here is loaded from a server.

`theme` state starts from the class the HTML script already set. `toggleTheme` flips the class, updates `color-scheme` (so form controls and scrollbars match), and stores `light` or `dark` in `localStorage`.

The health effect runs after the first render:

1. It creates an `AbortController`.
2. It `fetch`es `/api/health`.
3. A non-OK HTTP status becomes an error message.
4. JSON from a successful response is stored in `health`.
5. The cleanup function aborts the request if the component unmounts. That avoids setting state on a page that has already gone away.

`HealthDetails` is a small function in the same file. It renders the loading line, the error line, or the three facts from the JSON. `aria-live="polite"` lets a screen reader announce the result when it arrives.

## 6. `server/src/index.js`

This is the entire API.

`import 'dotenv/config'` loads `server/.env` if that file exists. If it does not, `process.env.PORT` and `process.env.CLIENT_ORIGIN` stay unset and the defaults are used: port `5000` and origin `http://localhost:5173`.

`cors({ origin: clientOrigin })` adds headers that allow the Vite page to read the response. A page from another origin is refused by the browser. `curl` is not a browser, so it is not affected by CORS.

`GET /api/health` returns JSON. `database` is the string `not-configured` on purpose. It tells you the process is alive and that MongoDB is not part of this feature.

`app.listen` starts accepting connections. The log line is how you know the port.

## 7. `server/package.json` and `client/package.json`

`"type": "module"` means these packages use `import` / `export`, not `require`.

Server scripts:

- `npm run dev` — `node --watch src/index.js`. Node restarts the process when the file changes.
- `npm start` — the same server without watch mode. Use this when you want a steady process.

Client scripts come from the Vite template:

- `npm run dev` — development server
- `npm run build` — production bundle in `client/dist/`
- `npm run preview` — serves that bundle locally
- `npm run lint` — runs Oxlint, which arrived with the Vite React template

## 8. `.gitignore`

Git should not store installed packages or secrets.

- `node_modules/` is rebuilt by `npm install`.
- `dist/` is rebuilt by `npm run build`.
- `.env` and `.env.*` are ignored, with an exception for `.env.example`.

The example files contain ports and local URLs only. They are safe to keep in Git.
