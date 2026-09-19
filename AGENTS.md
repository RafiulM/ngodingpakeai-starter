# Build on this starter

This is the **PostgreSQL base** of the ngodingpakeai starter family. Help beginners turn a plain-language idea into a working app. Keep explanations short, explain decisions in familiar words, and implement the smallest useful feature end to end. Ask only about product decisions that materially change the work.

## First prompt: set up, then build

A request to build or run an app includes preparing its local development environment. Do this on the first feature prompt even if the user never asks about a database. For read-only questions or reviews, do not start services unnecessarily.

1. Read `README.md`, `package.json`, and `.agents/skills/starter-setup/SKILL.md`.
2. If dependencies are missing, run `npm run setup`. If installed, run `npm run predev` and `npm run doctor`. These commands preserve existing settings and data, prepare missing secrets, start managed PostgreSQL, wait for health, and apply committed migrations. Fix a reported setup problem before relying on database behavior.
3. Use the local Docker database by default when no `DATABASE_URL` is supplied. Do not ask beginners to choose a database provider, generate passwords, copy environment files, or create tables. If an existing Docker installation is stopped, start it when permitted. If a prerequisite needs user action, explain the exact action and continue work that does not depend on it.
4. Start `npm run dev` in a persistent terminal unless this project's preview is already running. Verify the actual URL responds. Keep `BETTER_AUTH_URL` matched to that origin, including the port. Avoid duplicate servers.
5. Continue the user's requested feature. Setup alone does not complete a request to build an app.

Use the relevant skill below. Clients without skill discovery should open its file directly. `agent.md` is an alternate entrypoint to these canonical instructions.

| Task                                                   | Project skill                            |
| ------------------------------------------------------ | ---------------------------------------- |
| First app prompt or setup problem                      | `.agents/skills/starter-setup/SKILL.md`  |
| Start, inspect, stop, or troubleshoot the dev database | `.agents/skills/dev-database/SKILL.md`   |
| Build a feature, change the UI, or add data            | `.agents/skills/build-feature/SKILL.md`  |
| Create a dashboard/chatbot/other derivative            | `.agents/skills/create-variant/SKILL.md` |

## Development database

`compose.dev.yaml` runs PostgreSQL only; Next.js runs on the host. Use `npm run db:up`, `db:status`, `db:logs`, and `db:down` so private environment settings and the saved Compose project name are loaded. Fresh setup chooses a free database port, generates credentials, and stores data in a persistent named volume. `db:down` keeps that volume. Preserve `.env.local` and never run volume deletion or destructive resets to repair setup. Supplied external connections bypass Docker. See `docs/local-development.md` for the complete workflow.

## Current documentation with Context7

For library, framework, SDK, API, CLI, or cloud-service syntax, configuration, setup, migrations, or library-specific debugging, use Context7 even when the API seems familiar. Do not use it for pure business logic, general programming, or code review without an API question.

1. Call `resolve-library-id` with the library's official name and the actual question, unless the user supplied an exact Context7 library ID.
2. Select the official project or authoritative docs by relevance, reputation, coverage, and installed version. Refine a mismatched search.
3. Call `query-docs` with the resolved ID and a focused question. Use separate queries for unrelated concepts and observe the tool's call limits.
4. Check the examples against the installed version. If Context7 is unavailable, say so, use official documentation, and continue work that does not depend on the missing answer. Do not claim a connection was tested just because its config exists.

Project-scoped MCP files for Codex, Claude Code, Cursor, and VS Code are included. See `docs/ai-workflow.md` for activation. Never put credentials into prompts or committed MCP files.

## Code map and boundaries

- `src/app`: Next.js App Router pages. Server Components by default; use client components for interaction.
- `src/app/(auth)`: signup/signin. `src/app/(protected)`: protected app screens. Route-group names do not affect URLs.
- `src/lib/auth.ts`, `auth-client.ts`, `session.ts`: Better Auth server, browser client, and real database-backed session checks. Keep `nextCookies()` last in the plugin list.
- `src/lib/permissions.ts`: shared access control statement and roles for the Better Auth admin plugin. Imported by both the server and browser client, so keep it free of secrets and server-only imports.
- `src/db/schema/`, `src/db/index.ts`, `drizzle/`: PostgreSQL tables, shared node-postgres pool, committed migrations. Run on Node.js with a persistent PostgreSQL server.
- `src/app/api/`: thin HTTP route handlers. Use `withApiSession` from `src/lib/api.ts` for authenticated JSON endpoints.
- `src/services/`: server-only application logic and all domain Drizzle queries. Pass the verified session user ID separately; filter ownership in SQL.
- `src/validators/`: strict Zod input schemas and inferred types. See `docs/backend.md` and the Notes example.
- `src/components/ui`: owned shadcn/ui primitives. Reuse them and `cn()`; add components with `npx shadcn@4.21.0 add <component>`.
- `src/app/globals.css`: Tailwind v4 theme tokens. No Tailwind v3 config is needed. Motion imports come from `motion/react`; respect reduced motion.
- `starter.config.json` and `src/config/site.ts`: identity and common paths.

Authenticate at each server data boundary: use `requireSession()` for pages/actions, or `withApiSession(request, handler)` for APIs, which returns JSON 401 instead of redirecting. A protected layout alone does not protect actions or APIs. Filter every user-owned read/update/delete by the verified session's user ID; never trust a submitted owner ID. Keep secrets and database code server-only. Validate mutations server-side.

Authorize separately from authentication when a feature reaches past the caller's own rows. Declare the resource and actions in `src/lib/permissions.ts`, then guard with `withApiPermission(request, permissions, handler)` for APIs or `requirePermission(permissions)` for pages. Roles come from `user.role`, which signup cannot set; use `npm run role:set -- <email> <role>`. Name cross-account service functions with an `Any` suffix and call them only from a permission-guarded entrypoint. Hiding UI is never the access check. See the role section in `docs/backend.md`.

Use PostgreSQL pgTable/boolean/timestamp columns and asynchronous queries. DATABASE_URL is the runtime connection. MIGRATION_DATABASE_URL optionally provides a direct migration connection. Never substitute SQLite syntax or disable TLS verification. Tests require Docker and use unique disposable PostgreSQL servers.

Build application backend features with API routes calling services. Do not put domain queries in routes, pages, or components. Validate request bodies, IDs, and pagination before service calls. Require the configured Origin on cookie-authenticated mutations, including DELETE. Services contain SQL and domain logic; HTTP responses and cookie handling stay in the API layer. Reuse the Notes pattern documented in `docs/backend.md`.

Keep each Drizzle table in `src/db/schema/<table>.ts` and export it from `src/db/schema/index.ts`. Use direct sibling imports for foreign keys. For a schema change, edit the table file, run `npm run db:generate`, inspect the new SQL, then run `npm run db:migrate`. Commit SQL and `drizzle/meta` together. Do not rewrite applied migrations or run destructive resets to repair an error.

## Verify and hand off

Run `npm run check` and `npm run build` for substantive changes. For setup or Compose changes also run `npm run test:setup` to verify a fresh copy and data persistence. For auth/routing/session changes run `npm run test:e2e` after the build. Add tests for real behavior or data isolation when extending the app. Review the UI at narrow and wide widths when changing layout. Once the app has a real first screen, the starter placeholder (`data-starter-placeholder` in the signed-in app page) and `e2e/starter.spec.ts` must be gone; `npm run doctor` reminds you while they remain.

Report the result, how to use it, checks run, and any remaining limitation. Keep dashboard-specific, chatbot-specific, billing, and provider-specific features in derivatives unless the user asks to add them to this base. Do not deploy, purchase services, or choose an AI provider just because this is an AI-friendly starter.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
