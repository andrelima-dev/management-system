# syntax=docker/dockerfile:1.6

FROM node:22-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
WORKDIR /repo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps/api-gateway/package.json ./apps/api-gateway/package.json
RUN pnpm install --filter @jungle/api-gateway... --prod=false
COPY apps ./apps
RUN pnpm --filter @jungle/api-gateway build

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app
COPY --from=base /pnpm /pnpm
COPY --from=base /repo/apps/api-gateway/dist ./dist
COPY --from=base /repo/apps/api-gateway/package.json ./package.json
CMD ["node", "dist/main.js"]
