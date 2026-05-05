FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy files
COPY . .

# Install dependencies
RUN pnpm install

# Set PORT env var for build (operix vite config reads it at build time)
ENV PORT=3000

# Build only production artifacts (skip mockup-sandbox which is dev-only)
RUN pnpm run typecheck && \
    pnpm --filter @workspace/api-server run build && \
    pnpm --filter @workspace/operix run build

# Expose port
EXPOSE 3000

# Start the API server (serves built frontend as static files)
CMD pnpm --filter @workspace/api-server run start
