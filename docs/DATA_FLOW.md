# Data flow

Feature 1 has one real flow: the page asks the API whether it is running. No document is saved.

## Health check

```text
1. You open http://localhost:5173
2. The browser loads index.html
3. The theme script reads localStorage and may set class "dark" on <html>
4. The browser loads main.jsx, which renders App
5. App calls fetch("http://localhost:5000/api/health")
6. The browser sends that GET request to the Express process
7. Express matches app.get("/api/health")
8. Express sends JSON:
     ok, service, database: "not-configured", time
9. The browser checks CORS, then React stores the JSON in state
10. React draws the API status panel again with those three values
```

There is no step where MongoDB is contacted. The time in the JSON is generated on the server at the moment of the request. Refresh the page and the time changes. That is how you can see that the panel is showing a live response, not text baked into the React file.

## Where each fact lives

| Fact | Where it lives in Feature 1 | Will move later? |
|---|---|---|
| Theme choice | `localStorage` key `hazri-theme` in the browser | Stays in the browser. It is a display preference, not an account setting. |
| Role card text | The `roles` array in `App.jsx` | Replaced by real screens. Not stored in a database. |
| API alive or not | The JSON response, then React state | The health route can stay. Other data will come from MongoDB. |
| Users, classes, attendance | Nowhere | MongoDB, starting in a later feature |

React state disappears on a refresh. That is why the theme is also written to `localStorage`, and why the health panel asks the server again after every reload.

## What the browser is allowed to know

The browser receives only the health JSON. It does not receive a database connection string, because the server does not have one yet.

When accounts exist, the browser will receive a token and the fields a screen needs. It will not receive password hashes, OTP hashes, or another student's private dispute notes unless that user is allowed to see them.

## A flow we are not building yet

This is the later check-in path, written here so the foundation has a destination. None of these requests exist today.

```text
Mentor creates a session
  -> server stores the session and a hashed OTP

Student submits the OTP
  -> server compares it with the hash, checks the expiry,
     and checks that this student has not already checked in

Server writes one attendance row
  -> status PRESENT or PRESENT_LATE, method "otp", check-in time

Mentor reviews anyone still UNCONFIRMED
  -> a manual change stores the reason and the previous status
```

An OTP will show that someone who could see the mentor's screen submitted the code before it expired. It will not prove, by itself, that the enrolled student was physically in the room.
