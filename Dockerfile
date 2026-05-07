FROM node:22-alpine

WORKDIR /app

COPY . .

RUN npm install -g pnpm@9

RUN pnpm install --no-frozen-lockfile

RUN pnpm build

EXPOSE 8080

CMD ["pnpm", "start"]
