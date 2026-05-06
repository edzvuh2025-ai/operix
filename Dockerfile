FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy files
COPY . .

# Install dependencies
RUN pnpm install

# Build only the production artifacts (api-server + operix frontend)
# PORT and BASE_PATH are read by vite.config.ts at build time - defaults are now in config
RUN pnpm run typecheck && \
    pnpm --filter @workspace/api-server run build && \
    pnpm --filter @workspace/operix run build

# Expose port
EXPOSE 8080

# Start the API server (also serves the built React frontend as static files)
CMD ["node", "--enable-source-maps", "./artifacts/api-server/dist/index.mjs"]
