FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy files
COPY . .

# Install dependencies
RUN pnpm install

# Set PORT env var for build (required by mockup-sandbox vite.config)
ENV PORT=3000

# Build
RUN pnpm run build

# Expose ports
EXPOSE 8080 5173

# Start both services
CMD pnpm --filter @workspace/api-server run start & pnpm --filter @workspace/operix run preview
