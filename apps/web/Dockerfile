# ── Enagram Frontend ──
# Multi-stage build: compile TypeScript + Vite, then serve static files

# ── Stage 1: Build ──
FROM node:24-slim AS builder

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL:-http://localhost:4000/api/v1}

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@11 --activate

# Copy manifest files first (layer caching)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY tsconfig.json vite.config.ts index.html postcss.config.mjs ./
COPY public/ ./public/
COPY src/ ./src/

# Build with Vite (skips tsc type-check — esbuild handles transpilation)
RUN npx vite build

# ── Stage 2: Production runner ──
FROM node:24-slim AS runner

# Install a lightweight static file server with SPA fallback
RUN npm install -g serve@14

WORKDIR /app

# Copy only the built static files
COPY --from=builder /app/dist ./dist

# Expose frontend port
EXPOSE 5173

# Health check — serve responds with 200 on /
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:5173/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Serve the built app with SPA fallback (-s) on port 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
