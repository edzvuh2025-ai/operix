FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy files
COPY . .

# Install dependencies
RUN pnpm install

# Build only production artifacts (skip mockup-sandbox which is dev-only)
RUN pnpm run typecheck && \
    pnpm --filter @workspace/api-server run build && \
    pnpm --filter @workspace/operix run build

# Expose ports
EXPOSE 8080 5173

# Start both services
CMD pnpm --filter @workspace/api-server run start & pnpm --filter @workspace/operix run preview
