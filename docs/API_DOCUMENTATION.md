# API documentation

Base URL in local development: `http://localhost:5000`

Feature 1 has a single route. There is no authentication header, no request body, and no version prefix beyond `/api`.

## GET /api/health

Reports that the API process is running.

### Request

```http
GET /api/health HTTP/1.1
Host: localhost:5000
```

No query parameters. No body.

From the browser, the page must be served from the allowed origin. The default is `http://localhost:5173`. Change it with `CLIENT_ORIGIN` in `server/.env`.

### Success response

Status: `200 OK`

```json
{
  "ok": true,
  "service": "hazri-api",
  "database": "not-configured",
  "time": "2026-11-21T13:00:00.000Z"
}
```

| Field | Type | Meaning |
|---|---|---|
| `ok` | boolean | `true` when this route handled the request. It does not mean a database is healthy. |
| `service` | string | Always `hazri-api` in this feature, so you can tell this process from another app on the machine. |
| `database` | string | Always `not-configured` until a later feature connects MongoDB. |
| `time` | string | UTC time on the server when the response was created, in ISO 8601 format. |

### Errors you can actually cause

This route does not return a custom error body. The failures below happen before your handler's JSON is shown.

| Situation | What you observe |
|---|---|
| The server is not running | `curl` reports a connection failure. The React panel shows the unreachable message. |
| Another program owns port 5000 | The Hazri server does not start (`EADDRINUSE`). `curl` may hit that other program and return different JSON or HTML. |
| Browser origin is not allowed | `curl` still succeeds. The browser console shows a CORS error, and the React panel shows the unreachable message because `fetch` rejects. |

Unknown paths, such as `GET /api/users`, currently fall through Express's default 404. That response is not a Hazri error format. A shared error format will be introduced when the first real routes arrive.

### Example

```bash
curl -i http://localhost:5000/api/health
```

The `-i` flag prints the status line as well as the JSON. You should see `HTTP/1.1 200 OK` and a `Content-Type` containing `application/json`.
