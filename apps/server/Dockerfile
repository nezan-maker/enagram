# ── Enagram Backend ──
# Multi-stage build: compile TypeScript, then run with minimal deps

# ── Stage 1: Build ──
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY tsconfig.json ./
COPY src/ ./src/

RUN pnpm run build

# ── Stage 2: Production runner ──
FROM node:22-alpine AS runner

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist

RUN mkdir -p dist/uploads/images

EXPOSE 4000

CMD ["node", "dist/server.js"]
