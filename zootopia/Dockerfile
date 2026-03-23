# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /usr/src/app

# 1. Install dependencies
FROM base AS deps

RUN apk add --no-cache libc6-compat

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 2. Build project
FROM base AS builder
WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

RUN npm run build

# 3. Production
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production

RUN addgroup -S nodejs -g 1001
RUN adduser -S nextjs -u 1001

COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/.next/standalone ./
COPY --from=builder /usr/src/app/.next/static ./.next/static

# zmiana właściciela plików
RUN chown -R nextjs:nodejs /usr/src/app

USER nextjs

EXPOSE 3000

CMD ["node","server.js"]