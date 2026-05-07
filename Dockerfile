FROM node:22-alpine

WORKDIR /app

# Copy all source
COPY . .

# Install pnpm
RUN npm install -g pnpm@latest

# Create .npmrc to allow build scripts
RUN echo "ignore-scripts=false" > .npmrc

# Install dependencies
RUN PNPM_IGNORE_SCRIPTS=false pnpm install --no-frozen-lockfile

# Build all workspaces
RUN pnpm build

# Expose port
EXPOSE 8080

# Start API server
CMD ["pnpm", "start"]
