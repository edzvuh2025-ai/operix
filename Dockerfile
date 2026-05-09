FROM node:22-alpine

# Accept build arguments from Railway
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_CLERK_PROXY_URL

# Set them as environment variables for Vite
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PROXY_URL=$VITE_CLERK_PROXY_URL

WORKDIR /app

COPY . .

RUN npm install -g pnpm@10

RUN pnpm install --no-frozen-lockfile

RUN pnpm build

EXPOSE 8080

CMD ["pnpm", "start"]
