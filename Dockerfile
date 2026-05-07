FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm install -g pnpm
RUN pnpm install --no-frozen-lockfile
RUN pnpm run build
EXPOSE 8080
CMD ["pnpm", "start"]
