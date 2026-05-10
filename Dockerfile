FROM node:22-alpine

# Accept build arguments from Railway
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_CLERK_PROXY_URL

# Set environment variables for the build
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PROXY_URL=$VITE_CLERK_PROXY_URL

WORKDIR /app

RUN npm install -g pnpm

# Copy monorepo files (removed pnpm-lock.yaml as it doesn't exist)
COPY package.json pnpm-workspace.yaml ./

# Copy all workspaces
COPY lib ./lib
COPY artifacts ./artifacts

# Install dependencies with --no-frozen-lockfile to allow pnpm to generate lock file
RUN pnpm install --no-frozen-lockfile

# Build the database migrations
RUN pnpm -F @operix/db run build

# Run database migrations
RUN pnpm -F @operix/db run migrate

# Build the Vite frontend
RUN pnpm -F @operix/operix run build

# Build the API server
RUN pnpm -F @operix/api-server run build

# Remove development dependencies
RUN pnpm prune --prod

EXPOSE 3000

CMD ["pnpm", "-F", "@operix/api-server", "start"]
