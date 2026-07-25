# Nest API — production container (Railway / Fly / any Docker host)
FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json ./
COPY apps/api/package.json apps/api/
# postinstall → prisma generate; schema must exist before pnpm install
COPY apps/api/prisma apps/api/prisma
COPY packages/shared-types/package.json packages/shared-types/
COPY packages/shared-constants/package.json packages/shared-constants/
COPY packages/shared-validators/package.json packages/shared-validators/
ENV HUSKY=0
RUN pnpm install --frozen-lockfile --filter api...

FROM deps AS build
COPY apps/api apps/api
COPY packages packages
RUN pnpm --filter api build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system app && adduser --system --ingroup app app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/package.json ./apps/api/
COPY --from=build /app/apps/api/prisma ./apps/api/prisma
COPY --from=build /app/package.json ./
USER app
WORKDIR /app/apps/api
EXPOSE 4000
CMD ["node", "dist/src/main.js"]
