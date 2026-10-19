FROM node:20-alpine AS builder

WORKDIR /app

COPY backend/package*.json ./

RUN npm ci

COPY backend/ .

COPY shared/ /shared/

RUN npx prisma generate --config prisma.config.ts

RUN npm run build


FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY backend/package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
# the client is generated to generated/prisma (schema.prisma "output"), and its
# query engine binary lives there too, not in node_modules/.prisma
COPY --from=builder /app/generated ./generated

EXPOSE 3001

CMD ["npm", "start"]