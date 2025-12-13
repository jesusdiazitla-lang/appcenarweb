# ============================================
# Dockerfile - AppCenar
# Imagen optimizada para producción
# ============================================

# Etapa 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (incluidas devDependencies para build)
RUN npm ci

# Copiar código fuente
COPY . .

# ============================================
# Etapa 2: Producción
# ============================================
FROM node:18-alpine

# Metadata
LABEL maintainer="AppCenar Team"
LABEL version="1.0"
LABEL description="Sistema de pedidos y delivery"

# Variables de entorno por defecto
ENV NODE_ENV=production \
    PORT=8080 \
    NPM_CONFIG_LOGLEVEL=warn

WORKDIR /app

# Copiar solo package.json y package-lock.json
COPY package*.json ./

# Instalar SOLO dependencias de producción
RUN npm ci --only=production && \
    npm cache clean --force

# Copiar código desde builder
COPY --from=builder /app .

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Cambiar a usuario no-root
USER nodejs

# Exponer puerto
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:8080/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando de inicio
CMD ["npm", "start"]