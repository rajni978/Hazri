# Architecture

Hazri is two programs that talk over HTTP. The browser never talks to MongoDB. Feature 1 does not talk to a database at all.

```text
Browser (React, Vite, port 5173)
        |
        |  GET http://localhost:5000/api/health
        v
Express API (Node.js, port 5000)
        |
        |  not connected yet
        v
MongoDB (planned for Feature 2)
```

## Why two folders

`client/` is the website. It draws the page and sends requests.

`server/` is the API. It will later check who the user is, apply attendance rules, and read or write the database. Keeping it separate means a student cannot bypass a rule by editing the React page. The rule will live on the server.

`docs/` explains the system in plain language. It is part of the project, not an afterthought.

## Folder map

```text
Hazri/
├── client/
│   ├── index.html          Page shell, fonts, theme script
│   ├── vite.config.js      Vite plus the Tailwind plugin
│   ├── package.json        Frontend dependencies and scripts
│   ├── .env.example        Optional API address
│   ├── public/favicon.svg
│   └── src/
│       ├── main.jsx        Starts React
│       ├── App.jsx         The foundation page
│       └── index.css       Colours, fonts, Tailwind
├── server/
│   ├── package.json
│   ├── .env.example        Optional port and allowed browser origin
│   └── src/index.js        Express app and the health route
├── docs/
├── .gitignore
└── README.md
```

Later features will add folders only when they have a job, for example `server/src/models/` and `client/src/features/`. Empty folders are not created in advance.

## Processes you run

| Process | Command | Port | Job in Feature 1 |
|---|---|---|---|
| Vite | `npm run dev` in `client/` | 5173 | Serves the React page and reloads it on save |
| Express | `npm run dev` in `server/` | 5000 | Answers `GET /api/health` |

Vite's production build (`npm run build`) creates static files in `client/dist/`. We are not serving that build from Express yet. During learning, keep the two dev servers separate so you can see which one failed.

## Theme

Light and dark mode are a CSS class on `<html>`, not a second website.

- No class, or a stored value of `light`: cream page, charcoal text.
- Class `dark`: charcoal page, cream text.

Tailwind's `dark:` variants follow that class. See `client/src/index.css`.

## Boundaries we are keeping

- The API is JSON over REST. There is no GraphQL and no WebSocket in Feature 1.
- Secrets, when we add them, go in `.env` files that Git ignores.
- The health route is public. Later routes that read or change attendance will require a logged-in user and a role check on the server.
