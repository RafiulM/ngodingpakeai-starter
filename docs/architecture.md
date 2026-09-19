# Architecture

One app, one package, one PostgreSQL database. A monorepo or shared package layer is unnecessary for the base; derivatives begin as independent copies.

```text
src/
  app/
    page.tsx                    redirects to /app or /sign-in
    (auth)/                     sign-in and sign-up pages
    (protected)/app/page.tsx     blank, authenticated application
    api/auth/[...all]/route.ts   Better Auth's HTTP endpoints
    api/notes/route.ts           authenticated list/create example
    api/notes/[id]/route.ts      authenticated read/update/delete example
  components/
    ui/                         shadcn/ui source, owned by this project
    auth-form.tsx               interactive signin/signup form
    copy-prompt.tsx             used only by the placeholder app page
    providers.tsx               reduced-motion configuration
  config/site.ts                shared identity and app path
  db/
    schema/
      index.ts                  shared export entrypoint for all tables
      user.ts                   Better Auth user table
      session.ts                Better Auth session table
      account.ts                Better Auth provider/password table
      verification.ts           Better Auth verification table
      notes.ts                  example user-owned application table
    index.ts                    server-only PostgreSQL/Drizzle pool
  services/notes.service.ts     application rules and all Notes queries
  validators/notes.ts           strict request validation and input types
  lib/
    api.ts                      API session, origin, JSON, and error helpers
    auth.ts                     server-side Better Auth configuration
    auth-client.ts              same-origin browser client
    session.ts                  real session validation
    env.ts                      validated server settings
drizzle/                        SQL migrations and migration metadata
scripts/                        setup, diagnosis, migrations, safe copying
.agents/skills/                 workflows for coding assistants
```

## Request flow

The browser form calls Better Auth through `/api/auth`. Better Auth validates credentials, hashes passwords, writes through Drizzle, and manages session cookies. The browser redirects to `/app`. The protected layout and page read the session through Better Auth before displaying user information. Signout revokes the session through the same library.

`getSession()` is React-request-cached, not persistently cached between users. `requireSession()` redirects anonymous visitors to `/sign-in`. The base does not implement a second token system, middleware cookie-only authorization, or a custom password hasher.

Authentication at a layout is a UI gate. New actions and APIs must authenticate independently and filter user-owned rows by `session.user.id`. Return 401 from APIs for missing sessions; do not redirect an API client to an HTML signin page. Return a not-found result for a row the user does not own.

Application requests follow **API route → session/validation → service → Drizzle**. The [backend guide](backend.md) defines the HTTP contract and a complete CRUD example. Services receive a verified user ID and enforce ownership in their queries. The API layer owns request parsing, responses, mutation origin checks, and JSON errors. Database queries stay out of routes and components. Notes is a reference backend; its UI is left for feature work.

## Data and configuration

`.env.local` is ignored by Git. DATABASE_URL configures runtime PostgreSQL. MIGRATION_DATABASE_URL optionally supplies a direct connection for migrations. Process environment takes priority, followed by Next.js environment-file precedence. Setup appends only missing settings; external connections are preserved.

The application uses a node-postgres pool with five connections per process, timeouts, and an idle-error handler. Development hot reloads reuse the pool. Drizzle's pgTable schema uses PostgreSQL boolean and timestamptz types. Queries are asynchronous. Better Auth uses the pg adapter provider; the cookie prefix includes starter identity to coexist with other local apps.

With no supplied URL, setup creates random private credentials and a unique Compose project name, starts PostgreSQL 17 on an available loopback port, and waits for its healthcheck. A named Docker volume retains records across restarts. For a hosted database, setup skips Docker. Test commands always provision their own disposable PostgreSQL server with a random port; neither DATABASE_URL nor MIGRATION_DATABASE_URL from the app is used by tests.

Schema updates use `db:generate` then `db:migrate`. SQL and metadata must travel together. Startup does not run `db:push`, erase tables, or seed an account. Auth tables and migrations are part of the base's public maintenance contract.

## UI and future features

Server Components are the default. Client components are small interactive boundaries. Tailwind v4 tokens live in `globals.css`; shadcn components are normal editable source files. Motion respects reduced-motion preferences. System fonts avoid a build-time dependency on a font CDN.

The root route only redirects (signed in → `/app`, otherwise `/sign-in`); there is no public landing page to forget. The signed-in app page is the single starter placeholder, marked with `data-starter-placeholder`: `npm run doctor` reminds you while it exists, `e2e/starter.spec.ts` covers it and is deleted with it, and the other e2e specs assert behavior rather than starter copy. Reuse auth, setup, database, and UI when adding dashboard or chatbot features. Do not put feature conditionals throughout the base: create a derivative and implement that app directly.

## Dependency compatibility

TypeScript 5.9 and ESLint 9 are pinned to the versions accepted by the Next.js lint plugins. shadcn/ui's current CLI uses the `cn` utility package; `src/lib/utils.ts` exposes that same helper to application code. The `@esbuild-kit/core-utils` override updates Drizzle Kit's legacy nested esbuild dependency to the patched 0.25.12 release. Verify migration generation and setup whenever changing that override.
