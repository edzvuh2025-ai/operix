FROM node:22-alpine

WORKDIR /app

COPY . .

RUN npm install -g pnpm

# Allow build scripts to run, then install
RUN pnpm install --no-frozen-lockfile --allow-scripts

# Build the app
RUN pnpm run build

EXPOSE 8080

CMD ["pnpm", "start"]
