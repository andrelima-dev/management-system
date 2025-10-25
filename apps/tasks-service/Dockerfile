# syntax=docker/dockerfile:1.6

FROM node:22-alpine AS development
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
WORKDIR /repo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/tasks-service ./apps/tasks-service
RUN pnpm install --recursive --filter=@jungle/tasks-service
EXPOSE 3002
WORKDIR /repo/apps/tasks-service
CMD ["pnpm", "dev"]

FROM node:22-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
WORKDIR /repo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/tasks-service/package.json ./apps/tasks-service/package.json
RUN pnpm install --filter @jungle/tasks-service... --prod=false
COPY apps ./apps
RUN pnpm --filter @jungle/tasks-service build

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app
COPY --from=base /pnpm /pnpm
COPY --from=base /repo/apps/tasks-service/dist ./dist
COPY --from=base /repo/apps/tasks-service/package.json ./package.json
CMD ["node", "dist/main.js"]
