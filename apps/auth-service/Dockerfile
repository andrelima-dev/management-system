# syntax=docker/dockerfile:1.6

FROM node:22-alpine AS development
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
WORKDIR /repo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/auth-service ./apps/auth-service
RUN pnpm install --recursive --filter=@jungle/auth-service
EXPOSE 3001
WORKDIR /repo/apps/auth-service
CMD ["pnpm", "dev"]

FROM node:22-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
WORKDIR /repo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/auth-service/package.json ./apps/auth-service/package.json
RUN pnpm install --filter @jungle/auth-service... --prod=false
COPY apps ./apps
RUN pnpm --filter @jungle/auth-service build

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app
COPY --from=base /pnpm /pnpm
COPY --from=base /repo/apps/auth-service/dist ./dist
COPY --from=base /repo/apps/auth-service/package.json ./package.json
CMD ["node", "dist/main.js"]
