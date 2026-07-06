---
name: railway
description: >
  Use for ALL Railway deployment work — deploys, crashes, build/boot failures,
  env vars, logs, DB connection issues, and post-deploy verification. Invoke
  whenever a deploy is red, the app is down, or you need to read production
  logs. Trigger on: railway, deploy, deployment, crash, build failed, ENOTFOUND,
  migration failed, logs, env var, DATABASE_URL, container, redeploy, live site.
---

# Railway Skill | Struq — Deployment Operating SOP

> The single entry point for operating the Struq deploy on Railway. Invoke this
> **any time** a deployment misbehaves before touching code or env. It encodes
> the linking model, the debug loop, and the exact failure signatures we have
> already hit and fixed.

## Project topology (know this before you touch anything)

- **Project:** `StruqV`  ·  **Environment:** `production`
- **Services:** `StruqVisual` (the Next.js app) and `Postgres` (Postgres 18, SSL).
- **Deploy trigger:** GitHub `Deckdot/StruqVisual` → **push to `main`** auto-builds.
  There is *no* manual promote step — merging to main IS the deploy.
- **Build:** Dockerfile (`railway.json` → `builder: DOCKERFILE`), Next.js
  `output: 'standalone'`.
- **Boot:** `start.sh` runs the migrator (`node migrate.cjs`) **then** `server.js`.
  A failed migration exits before Next serves traffic — so a bad DB URL takes
  the whole container down, not just one route.

## First move on ANY deploy issue: establish the link

The CLI must be pointed at the right project **and** service or every command
either errors or targets the wrong thing.

```bash
railway whoami                         # confirm auth (expect royheilbron@hotmail.com)
railway status                         # Project / Environment / Service
# If "No linked project" or "Service: None":
railway link --project StruqV          # non-interactive; picks production
railway service StruqVisual            # link the APP service (not Postgres)
```

`railway status --json` dumps the full topology (service ids, source repo,
branch, latest deployment) when you need to see services or confirm the deploy
source.

## The debug loop (logs → diagnose → fix → verify)

1. **Read logs.** `railway logs --deployment` = build+boot of the latest deploy;
   `railway logs` = live runtime logs (this is where 500s and stack traces land).
   Wrap in `timeout 30 railway logs` so it doesn't hang the shell — it streams.
2. **Reproduce from the edge.** Hit the live URL and read the status code:
   ```bash
   curl -s -o /dev/null -w "HTTP %{http_code}\n" https://struqvisual-production.up.railway.app/<path>
   ```
   A route that 500s while `/` is 200 is almost always a **runtime module-eval
   or DB error** — go straight to `railway logs`.
3. **Fix the root cause** (code or env — see below). Never patch by disabling a
   route.
4. **Ship + verify.** Push to main (code) or `railway redeploy --yes` (env-only
   change). Then re-run the exact curl that was red until it's green, and
   confirm the log shows the migrator + `✓ Ready`.

## Env vars via CLI (never hand-edit in the dashboard blindly)

```bash
railway variables                                   # table
railway variables --kv                              # KEY=value (greppable)
railway variables --set 'KEY=value' --skip-deploys  # set without redeploying
railway variables --set 'KEY=value'                 # set AND redeploy
```

**Reference the Postgres service — never paste a raw DB URL.** These stay in
sync if credentials rotate:

```bash
railway variables --set 'DATABASE_URL=${{Postgres.DATABASE_URL}}'
railway variables --set 'DATABASE_URL_MIGRATION=${{Postgres.DATABASE_URL}}'
```

Always mask secrets when echoing logs/vars into a transcript:
`... | sed -E 's#(://[^:]+:)[^@]+@#\1***@#'`.

## Known failure signatures (we have hit and fixed these)

| Log / symptom | Root cause | Fix |
|---|---|---|
| Build: `DATABASE_URL is not set` during "Collecting page data" | A module threw at **import** time when env absent; `next build` evaluates route modules with no runtime env | Build DB client **lazily** (Proxy in `lib/db/client.ts`) — import must never touch env/sockets. |
| Runtime 500 `Unsupported database type (object) in Auth.js Drizzle adapter` | The lazy `db` Proxy defeats the adapter's dialect detection | Pass the **resolved** client `getDb()` (not the proxy) to `DrizzleAdapter`, still gated on `hasDatabase`. |
| `migration failed: getaddrinfo ENOTFOUND host` | `DATABASE_URL_MIGRATION` held the **placeholder** `user:password@host:5432/database` | Point it at `${{Postgres.DATABASE_URL}}` and redeploy. |
| `JWTSessionError: no matching decryption secret` | A browser holds a session cookie signed with an **old** `AUTH_SECRET` | Benign — not a crash. Self-heals on next sign-in / cookie clear. Only act if `AUTH_SECRET` is genuinely unset. |
| App up but DB-backed routes return `[]` / empty | Fresh Postgres — **canon not imported / not seeded** | Run the canon import + seed against the Railway DB (see below). |

## Env expectations for a healthy prod boot

- `DATABASE_URL` **and** `DATABASE_URL_MIGRATION` → `${{Postgres.DATABASE_URL}}`
  (internal `postgres.railway.internal` host).
- `DB_SSL=require` (Railway Postgres is SSL; `postgres.js` `ssl:'require'`
  requests TLS without cert verification — correct for the internal image).
- `AUTH_URL` **and** `NEXT_PUBLIC_APP_URL` → the **live public URL**, never
  `localhost` (localhost breaks OAuth callbacks and absolute links).
- `AUTH_TRUST_HOST=true` (required behind Railway's proxy).
- `AUTH_SECRET` set to a stable production secret (`openssl rand -base64 32`).

## Seeding a fresh Railway DB

Migrations run automatically on deploy, but **canon import + seed do not**. Run
them explicitly against the Railway DB (one-off), e.g. via
`railway run npm run db:seed` / the canon import script, or a Railway one-off
command with `DATABASE_URL` injected. Verify with the search route returning
non-empty results.

## Safety rails

- **Never** push straight to `main` without explicit user go-ahead — merging
  deploys to production. Prefer a `fix/…` branch; ship only when the user says so.
- **Never** run `db:push` or hand-write migration SQL (see `database` skill) —
  the migrator runs on every container start.
- Env changes that don't need a rebuild: use `--skip-deploys`, then a single
  `railway redeploy --yes` at the end. Don't trigger N redeploys for N vars.
- Redeploy vs push: **env-only** change → `railway redeploy` is enough; **code**
  change → it must reach GitHub `main` (Railway builds from the repo, not your
  working tree — `railway up` only for a deliberate out-of-band test deploy).
- Mask every secret before it lands in a log or transcript.

## Quick command reference

```bash
railway whoami                         # auth check
railway status                         # link state
railway link --project StruqV          # link project (→ production)
railway service StruqVisual            # link the app service
railway variables --kv                 # dump vars (greppable)
railway variables --set 'K=V'          # set var (+redeploy)
railway logs --deployment              # build + boot logs
railway logs                           # live runtime logs (500s, traces)
railway redeploy --yes                 # redeploy current build (env changes)
railway domain                         # show/create the public domain
railway run <cmd>                      # run a cmd with prod env injected
```

## Verification

- Deploy/env fix: confirm `railway logs --deployment` shows migrations applied +
  `✓ Ready`, then curl the affected route(s) to a green status. That is the
  deploy-tier equivalent of `T2` — behavior observed on the live edge, not just
  a green local build.

## Editing this skill

Edit **only** the canonical copy at `.skillshare/skills/railway/SKILL.md`, then
run `skillshare sync` in the same turn to regenerate the mirrors (the CLI is
always installed). See the `master-orchestrator` skill for the full rule.
