# ---- Etapa de build ----
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar package.json y lock
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código
COPY . .

# Generar cliente de Prisma
RUN npx prisma generate

# Build de Next.js
RUN npm run build

# ---- Etapa de runtime ----
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Necesario para Next en producción
RUN addgroup -g 1001 -S nodejs \
  && adduser -S nextjs -u 1001

# Copiar dependencias (node_modules) y build desde el builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.* ./ 
COPY --from=builder /app/postcss.config.* ./ 
COPY --from=builder /app/tailwind.config.* ./ 
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
