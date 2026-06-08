# ── Enagram Backend ──
# Multi-stage build: compile TypeScript, then run with minimal deps

# ── Stage 1: Build ──
FROM node:24-slim AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@11 --activate

# Copy manifest files first (layer caching)
COPY package.json pnpm-lock.yaml ./
# pnpm v11: install without build scripts → approve them → reinstall with builds
RUN pnpm install --ignore-scripts && \
    pnpm approve-builds --all && \
    pnpm install

# Copy source
COPY tsconfig.json ./
COPY src/ ./src/

# Build TypeScript → dist/
RUN pnpm run build

# ── Stage 2: Production runner ──
FROM node:24-slim AS runner

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@11 --activate

# Copy production dependencies only (no esbuild in prod deps, so ignore-scripts is safe)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --ignore-scripts

# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist

# Create uploads directory (for multer image uploads)
RUN mkdir -p dist/uploads/images

# Expose API port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:4000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Start server
CMD ["node", "dist/server.js"]
