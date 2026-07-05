---
name: mcp
description: >
  Use for MCP server work — transport, OAuth PKCE discovery, protected-resource metadata, tokens, tools, client setup.
  Trigger on: mcp, mcp server, tool_call, oauth, .well-known, bearer token, mcp.json.
---

# MCP Skill | Struq

## Scope

- `app/api/mcp/**`, `app/.well-known/**`, `lib/mcp/**`, token service, `smithery.yaml`

## Source Of Truth

- Transport + auth boundary: `app/api/mcp/route.ts` · tool/resource/prompt registration: `lib/mcp/server.ts`
- OAuth metadata: `app/.well-known/oauth-authorization-server/` · protected-resource metadata: `app/.well-known/oauth-protected-resource/`

## Protocol Contract

- `GET/POST/DELETE /api/mcp`, stateless per request: build a fresh `McpServer` per request on the streamable HTTP transport.
- Requires `Authorization: Bearer` token, validated **before** server instantiation.
- `401` responses include RFC 9728 `WWW-Authenticate` with `resource_metadata`; `403` = valid token but tier does not allow the operation.
- Scopes: `vault:read` (list/search/get) and `vault:write` (create/update/save).

## Implementation Rules

- CORS headers on every MCP response including errors, from a single helper with an origin allowlist — never `Access-Control-Allow-Origin: *`. Keep `OPTIONS` preflight enabled.
- All OAuth redirect URLs built via one public-URL helper (env-priority based) — never from `request.url` (breaks behind proxies).
- `redirect_uri` must pass safety validation (`https://` or loopback `http://` only) before any redirect, including the deny flow.
- **Tool surface is visual-first**: tools operate on the five asset types (list/search/get assets, get asset returns the copyable prompt + tokens, kits CRUD, save/favorite). No prompt-first tool taxonomy.
- When tools/resources/prompts change, update `lib/mcp/server.ts` registration and `FEATURES.md` in the same PR.

## Verification

- Route/header/auth changes: `T3` minimum · plus a manual client connection test for OAuth/transport changes.
