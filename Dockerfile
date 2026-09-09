# Production image for the Next.js app. PostgreSQL is a separate managed
# service: compose.dev.yaml is for local development only and is not used here.
#
#   docker build -t my-app .
#   docker build --target migrator -t my-app-migrate .
#
# Run the migrator once per release, then start the app. See docs/deployment.md.

ARG NODE_VERSION=22-slim

# --- Build dependencies ------------------------------------------------------
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

# --- Build the standalone server ---------------------------------------------
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# next build reads DATABASE_URL and BETTER_AUTH_SECRET while collecting page
# data, so both must parse. These placeholders stay on this one command: they
# are not stored in image metadata, and server code reads process.env when a
# request arrives. Supply real values to the running container, not the build.
RUN DATABASE_URL=postgresql://build:build@127.0.0.1:5432/build \
    BETTER_AUTH_SECRET=placeholder-for-build-only-replaced-at-runtime \
    npm run build

# --- Shared runtime: only the files the standalone server traced --------------
FROM node:${NODE_VERSION} AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN mkdir .next && chown node:node .next
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# --- Migrator: apply committed SQL once per release --------------------------
# Uses MIGRATION_DATABASE_URL when set, otherwise DATABASE_URL. drizzle-orm has
# no runtime dependencies, and the standalone bundle already carries pg.
FROM runtime AS migrator
COPY --from=deps --chown=node:node /app/node_modules/drizzle-orm ./node_modules/drizzle-orm
COPY --chown=node:node drizzle ./drizzle
COPY --chown=node:node scripts ./scripts
USER node
CMD ["node", "scripts/migrate.mjs"]

# --- Runner: the app. Keep last so it stays the default build target ----------
FROM runtime AS runner
USER node
EXPOSE 3000

# Liveness only: a static asset, so a database outage does not restart the app.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 CMD \
  node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/icon.svg').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"

CMD ["node", "server.js"]
