FROM node:22-alpine

WORKDIR /app

# Copy everything
COPY . .

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build all packages
RUN pnpm run build

# Expose port
EXPOSE 8080

# Start API server
CMD ["pnpm", "start"]
