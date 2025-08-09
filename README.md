# FearX Panel (Cfx.re login + server linking)

This version adds:
- **Login with Cfx.re** via the forum.cfx.re **User API Key** flow
- **Connect Server**: generate a unique key in the panel, put it in `server.cfg`, and the panel polls until your server pings `/api/hello`

## Environment (Vercel → Project Settings → Environment Variables)
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE=...
SESSION_SECRET=change-me

CFX_CLIENT_ID=your-client-id
CFX_SCOPES=session_info
CFX_APP_NAME=FearX Panel
```

### Supabase setup
- Use your earlier schema (`players`, `events`, `bans`) and add the **server_keys** table by running `schema.sql`.
- Enable **Realtime** for `events`, `players`, `bans` (server_keys optional).

### Cfx.re login
- This uses Discourse's **User API Key** flow used by forum.cfx.re.
- You need a **client_id** approved for the forum integration (some communities have this enabled for external apps).
- The app redirects users to `https://forum.cfx.re/user-api-key/new` with scopes and a redirect back to `/api/cfx/callback`.

> For production, verify the payload per Discourse docs and store the user key server-side. This starter stores only a **masked preview** in a signed session cookie.

### Server linking
- Go to **/connect**, click **Generate key**, add this line to `server.cfg`:
  ```
  setr fearx_server_key <the-key>
  ```
- Add the heartbeat code from `ingest_examples/hello.lua` to a server resource. It POSTs to `/api/hello` with `Authorization: Bearer <key>`.
- The panel will show **connected** and let you continue to the dashboard.

### Notes
- Keep `SUPABASE_SERVICE_ROLE` secret (server-only). Never expose it on the client.
- The older `/api/ingest` endpoint can coexist if you want to send events; reuse from the previous build or add it similarly.
