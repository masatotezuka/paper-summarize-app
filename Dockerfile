FROM node:18-alpine AS base

RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .
RUN npm install -g pnpm
RUN pnpm i --frozen-lockfile
RUN pnpm build
ENV NODE_ENV production

EXPOSE 3000
ENV PORT 3000

CMD ["pnpm", "start"]
