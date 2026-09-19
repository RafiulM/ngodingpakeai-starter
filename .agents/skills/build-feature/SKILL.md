---
name: build-feature
description: Build or change a feature in this Next.js starter, including UI, authenticated API routes, services, and PostgreSQL data while reusing the existing authentication and components.
---

Read `AGENTS.md`, `docs/architecture.md`, `docs/backend.md`, and relevant feature files. On a fresh project, follow the starter-setup skill first, then continue the feature without requiring a separate setup prompt. Infer routine implementation details; clarify product ambiguity only when it changes the outcome. Deliver a usable slice with real behavior, appropriate loading/empty/error states, and readable beginner-facing explanations.

Consult Context7 as described in `AGENTS.md` before relying on library APIs. Inspect installed versions instead of adding a second framework, ORM, auth library, component system, or motion package.

Place pages in `src/app`; reuse `(protected)` for signed-in screens. Keep interactive UI in client components. Browser data operations use Next.js API routes under `src/app/api/`. Follow the Notes routes and `src/services/notes.service.ts` as the reference.

- Routes authenticate with `withApiSession`, validate inputs using strict schemas under `src/validators/`, call services, and shape HTTP responses. Await dynamic route params. Return JSON 401 for anonymous users and identical 404 responses for absent/unowned records. Preserve mutation Origin checks and `private, no-store` responses.
- Put all application Drizzle queries and domain rules in server-only `src/services/*.service.ts`. Pass the verified session user ID as a separate argument, never from submitted data. Filter every owned read/update/delete in SQL; assign ownership from that argument on creation. Services do not read request cookies, redirect, or construct HTTP responses.
- Server-rendered reads may reuse services after `requireSession()` at the data boundary. Keep domain queries out of pages and route handlers. Use API routes for ordinary browser mutations rather than adding a parallel Server Action flow.
- Validate request bodies, IDs, and pagination before queries. Reject unknown or owner fields. For partial updates require an editable field. Reuse shared error responses; never return raw database exceptions.

Definition of done for the first feature: the signed-in app page no longer carries the starter's blank canvas. Remove the `data-starter-placeholder` section (and the `CopyPrompt` usage if nothing else needs it), delete `e2e/starter.spec.ts`, and confirm `npm run doctor` prints no placeholder reminder. The root route only redirects; add a public landing page there only if the product needs one. Never ship the placeholder as if it were the app.

Add each table to `src/db/schema/<table>.ts` and export it from `src/db/schema/index.ts`. Import foreign-key dependencies directly from sibling files. Keep Better Auth's core tables intact. Generate, inspect, and apply a new migration. Store only requested data; do not seed demo users or silently delete the Notes example's saved records.

Reuse `src/components/ui`, `cn()`, and CSS tokens. Prefer semantic controls, explicit labels, visible focus, and responsive layouts. Use Motion where helpful and preserve `MotionConfig reducedMotion="user"`.

Validate actual behavior with tests like `e2e/notes.spec.ts`: anonymous access, CRUD persistence, invalid input, cross-account isolation, and revoked sessions. Tests must exercise the real routes and service queries against disposable PostgreSQL. Run the applicable checks in `AGENTS.md`. Update relevant docs and explain what the user can now do. Do not describe simulated interactions as working functionality.

Use pgTable, PostgreSQL boolean columns and timestamps with time zone. All database queries are asynchronous. Preserve the shared connection pool and Better Auth provider pg. Tests run through npm test or npm run test:e2e so they use their own PostgreSQL server.
