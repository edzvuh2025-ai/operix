FROM node:22-alpine

WORKDIR /app
COPY . .

# Install pnpm
RUN npm install -g pnpm@10

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Build (env vars from Railway's build context)
ENV NODE_ENV=production
RUN pnpm build

# Start the API server (which serves frontend)
CMD ["pnpm", "--filter=@operix/api-server", "start"]
