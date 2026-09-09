# PostgreSQL base

Derived from SQLite base version 0.1.0.

This starter keeps Next.js, Better Auth, Tailwind, shadcn/ui, Motion, Context7, and the project skill workflows. The storage layer is a separate PostgreSQL implementation.

Changes:

- Drizzle's node-postgres driver and a reused connection pool replace the native SQLite driver.
- Auth tables use pgTable, booleans, and timestamps with time zone.
- Fresh PostgreSQL SQL and migration metadata replace the copied SQLite migration history. This is a new database, not an existing-user data migration.
- DATABASE_URL configures runtime access; optional MIGRATION_DATABASE_URL supplies a direct migration connection.
- Local Docker setup generates its own password and project name, waits for database health, and keeps a persistent named volume.
- Signup/session cookies use the starter ID in their prefix so this edition can run alongside the SQLite starter on localhost.
- Tests create and clean up disposable PostgreSQL containers.
- The derivative copier includes both Compose files.
- Documentation and project skills describe PostgreSQL operations.

No existing SQLite records are imported. Dashboard and chatbot product features remain future derivatives.
