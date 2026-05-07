FROM node:22-alpine

WORKDIR /app

# Copy everything
COPY . .

# Install pnpm
RUN npm install -g pnpm

# Install all dependencies (will respect .npmrc)
RUN pnpm install --no-frozen-lockfile

# Build
RUN pnpm build

# Expose port
EXPOSE 8080

# Start API server
CMD ["pnpm", "start"]
