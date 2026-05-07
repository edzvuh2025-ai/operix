FROM node:22-alpine

WORKDIR /app

COPY . .

RUN npm install -g pnpm

# Install with ignore-scripts disabled (allow build scripts)
RUN pnpm install --no-frozen-lockfile --config.ignore-scripts=false

# Build both frontend and backend
RUN pnpm run build

EXPOSE 8080

CMD ["pnpm", "start"]
