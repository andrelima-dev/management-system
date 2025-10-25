# syntax=docker/dockerfile:1.6

FROM node:22-alpine AS development
RUN apk add --no-cache python3 make g++
WORKDIR /repo
COPY . /repo
WORKDIR /repo/apps/web
RUN rm -rf node_modules package-lock.json && npm install --no-audit --legacy-peer-deps
EXPOSE 5173
CMD ["npx", "vite", "--host", "0.0.0.0"]
