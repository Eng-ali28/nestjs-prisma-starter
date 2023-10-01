FROM node:18.18.0-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm build

FROM node:18.18.0-alpine

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD [ "pnpm", "start:prod" ]