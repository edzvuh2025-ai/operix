FROM node:22-alpine

WORKDIR /app

# Copy all source
COPY . .

# Install pnpm
RUN npm install -g pnpm@latest

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Build all workspaces
RUN pnpm build

# Expose port
EXPOSE 8080

# Start API server
CMD ["pnpm", "start"]
