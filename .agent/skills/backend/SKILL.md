---
name: backend
description: >
  Use for API routes, auth guards, service-layer changes, validation, Stripe, and serialization.
  Trigger on: API route, endpoint, route.ts, handler, middleware, auth, session, service, validation, Zod,
  server action, response shape, status code, CORS, Stripe, webhook, or files under app/api/**.
---

# Backend Skill | Struq

## Scope

- `app/api/**`, `lib/services/**`, `lib/auth*.ts`, `lib/validations/**`

## Contract Path

```text
client query/provider → API route → service layer → Drizzle → Postgres
```

Keep all layers aligned when changing a contract. The service layer owns DB-to-API mapping; never leak Drizzle rows or DB-specific shapes directly into UI responses.

## Rules

- Every user-owned route is auth-scoped; check the session before touching data.
- Validate request bodies (Zod) before persisting. Reject early, respond with a clear status code.
- If assets get soft delete, every active-asset query must filter deleted rows in the service layer; only trash/restore/purge routes may omit it.
- Tier gating lives server-side: `free` vs `pro` access to premium assets is enforced in the service layer, never only in the UI.
- Stripe webhooks are the single source of truth for subscription state; never trust client-reported tier.
- Update `lib/types.ts` when a runtime contract materially changes, in the same PR.

## Verification

- Route or logic change: `T1` minimum · runtime-behavior change: `T2`+ · route/config structure: `T3` · auth/billing flows: `T4`.
