# FearX Panel (Next.js + Supabase, Live Updates)

A clean anti-cheat panel with **Dashboard, Live Logs, Players, Bans** and **live updates** via Supabase Realtime.

## Features
- Live event stream using Supabase Realtime (Postgres change feeds)
- Ingestion API (`POST /api/ingest`) with Bearer token
- Players auto-upsert on ingest
- Tailwind UI with a modern, clean look
- Vercel-ready

---

## 1) Create Supabase project (Free)
1. Go to https://supabase.com/ and create a new project.
2. Grab your **Project URL** and **Anon Key** (Settings → API).
3. Generate a **Service Role Key** (Settings → API). **Keep this secret**.

## 2) Create tables & policies
1. Open the **SQL Editor** in Supabase and run the contents of `schema.sql` from this repo.
2. Turn on **Realtime** for `events`, `players`, and `bans` (Database → Replication).
3. Confirm Row Level Security (RLS) is enabled and the `select` policies are added for `authenticated` (see `schema.sql`).

## 3) Deploy to Vercel
1. Create a new Vercel project and select this folder.
2. Set these **Environment Variables** in Vercel (Project Settings → Environment Variables):

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE=your-service-role-key
   FEARX_API_KEY=change-this-to-a-strong-secret
   NEXT_PUBLIC_PANEL_NAME=FearX Panel
   ```

3. Click **Deploy**.

## 4) Test locally (optional)
```bash
npm install
cp .env.example .env.local   # fill it
npm run dev
```

## 5) Send events from your FiveM server
In your anti-cheat, post JSON to your Vercel URL:

```lua
local PANEL_URL = "https://<your-vercel-deployment>/api/ingest"
local API_KEY   = "<FEARX_API_KEY>"
local json = json -- use your server's json helper

function SendEvent(ev)
  PerformHttpRequest(PANEL_URL, function() end, "POST", json.encode(ev), {
    ["Content-Type"] = "application/json",
    ["Authorization"] = ("Bearer %s"):format(API_KEY)
  })
end

-- example
SendEvent({
  server_name = GetConvar("sv_hostname", "My Server"),
  player = { id = src, name = GetPlayerName(src), license = "license:...", discord = "discord:..." },
  code = "teleport",
  severity = "high",
  detail = { distance = 152.4 }
})
```

If the request succeeds, you should see the event appear instantly on **/logs** and in **Dashboard** "Recent Activity".

## Notes
- **Auth**: By default, tables allow `select` for **authenticated** users. You can add Supabase Auth (Discord OAuth) quickly:
  - Go to Supabase → Authentication → Providers, enable **Discord**, set callback URLs for your Vercel domain.
  - In the app, use `supabase.auth.signInWithOAuth({ provider: "discord" })` and protect routes by checking `supabase.auth.getSession()`.
- **Security**: The ingestion route requires `FEARX_API_KEY` and uses **Service Role** to write to DB. Never expose the service role in the client.

## Extending
- Add KPIs (counts/last 24h) to the Dashboard via SQL aggregate queries.
- Attach actions (kick/ban) by creating server-side routes and a secure control channel.
- Replace Tailwind components with shadcn/ui if you want more polish.
