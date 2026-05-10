FROM node:22-alpine

WORKDIR /app
COPY . .

# Install pnpm
RUN npm install -g pnpm@10

# Install dependencies (WITHOUT --no-scripts so build scripts can run)
RUN pnpm install --no-frozen-lockfile

# Accept build args
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG AI_INTEGRATIONS_OPENAI_BASE_URL
ARG AI_INTEGRATIONS_OPENAI_API_KEY

ENV VITE_CLERK_PUBLISHABLE_KEY=${VITE_CLERK_PUBLISHABLE_KEY}
ENV AI_INTEGRATIONS_OPENAI_BASE_URL=${AI_INTEGRATIONS_OPENAI_BASE_URL}
ENV AI_INTEGRATIONS_OPENAI_API_KEY=${AI_INTEGRATIONS_OPENAI_API_KEY}
ENV NODE_ENV=production

# Build all packages
RUN pnpm build

# Run database migrations and start the API server
CMD sh -c "pnpm --filter=@operix/db run migrate && pnpm --filter=@operix/api-server start"
