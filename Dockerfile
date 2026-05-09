FROM node:22-alpine

# Accept build arguments from Railway
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_CLERK_PROXY_URL

# Set environment variables for the build stage
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PROXY_URL=$VITE_CLERK_PROXY_URL

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

COPY . .

# Build the frontend and compile the API
RUN pnpm build

# Run database migrations
RUN pnpm -F @operix/db run migrate

EXPOSE 3001

CMD ["pnpm", "start"]
