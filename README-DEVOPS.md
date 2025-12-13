# 🚀 AppCenar - Proyecto DevOps

Sistema de pedidos y delivery implementado con prácticas DevOps modernas.

---

## 📋 Tabla de Contenidos

- [Características DevOps](#características-devops)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Despliegue](#instalación-y-despliegue)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoreo y Logs](#monitoreo-y-logs)
- [Pruebas](#pruebas)
- [Arquitectura](#arquitectura)

---

## 🎯 Características DevOps

### ✅ Control de Versiones
- **Git/GitHub**: Repositorio completo con historial
- **Branching Strategy**: main/develop
- **Pull Requests**: Revisión de código

### ✅ Contenedores
- **Docker**: Dockerfile multi-stage optimizado
- **Docker Compose**: Orquestación local
- **Health Checks**: Verificación de servicios

### ✅ CI/CD
- **GitHub Actions**: Pipeline automatizado
- **Testing**: Pruebas unitarias e integración
- **Linting**: ESLint para calidad de código
- **Build & Deploy**: Construcción automática de imágenes

### ✅ Monitoreo
- **Winston**: Sistema de logging estructurado
- **Métricas**: Colección de métricas de sistema y requests
- **Health Endpoints**: `/health`, `/health/live`, `/health/ready`

### ✅ Pruebas
- **Jest**: Framework de testing
- **Cobertura**: Reports de cobertura
- **Tests unitarios**: Helpers, modelos
- **Tests de integración**: API endpoints

---

## 🔧 Requisitos Previos

### Local Development
```bash
node --version  # v18 o superior
npm --version   # v9 o superior
```

### Docker Deployment
```bash
docker --version        # v20 o superior
docker-compose --version # v2 o superior
```

---

## 🚀 Instalación y Despliegue

### Opción 1: Docker Compose (RECOMENDADO)

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/appcenar.git
cd appcenar
```

2. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus valores
```

3. **Levantar los servicios**
```bash
docker-compose up -d
```

4. **Verificar servicios**
```bash
docker-compose ps
```

5. **Ver logs**
```bash
docker-compose logs -f app
```

6. **Crear administrador inicial**
```bash
docker-compose exec app npm run seed:admin
```

7. **Acceder a la aplicación**
```
http://localhost:8080
```

### Opción 2: Local Development

1. **Instalar dependencias**
```bash
npm install
```

2. **Iniciar MongoDB**
```bash
# Usar Docker para MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

3. **Configurar .env**
```bash
cp .env.example .env
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

#### 1. CI Pipeline (`.github/workflows/ci.yml`)
**Trigger**: Push/PR a main o develop

**Etapas**:
```yaml
1. Checkout código
2. Setup Node.js (18.x, 20.x)
3. Instalar dependencias
4. Ejecutar linter (ESLint)
5. Ejecutar tests
6. Subir cobertura (Codecov)
```

**Ejecución**:
```bash
# Local
npm run lint
npm run test:ci
```

#### 2. Docker Build (`.github/workflows/docker.yml`)
**Trigger**: Push a main o tags

**Etapas**:
```yaml
1. Checkout código
2. Setup Docker Buildx
3. Login a Docker Hub
4. Extraer metadata (tags)
5. Build y Push imagen
```

**Build local**:
```bash
docker build -t appcenar:latest .
```

### Ejecutar Pipeline Localmente

```bash
# Tests
npm run test

# Linting
npm run lint

# Build Docker
docker build -t appcenar:test .

# Test con Docker
docker run -p 8080:8080 --env-file .env appcenar:test
```

---

## 📊 Monitoreo y Logs

### Health Checks

**Endpoint principal**:
```bash
curl http://localhost:8080/health
```

Respuesta:
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "uptime": 3600,
  "checks": {
    "database": {
      "status": "connected",
      "name": "appcenar"
    },
    "memory": {
      "status": "ok",
      "used": "150.25 MB",
      "percentage": "45.30%"
    }
  }
}
```

**Kubernetes Probes**:
```bash
# Liveness
curl http://localhost:8080/health/live

# Readiness
curl http://localhost:8080/health/ready
```

### Sistema de Logs

**Ubicación**: `./logs/`

Archivos generados:
- `combined.log`: Todos los logs
- `error.log`: Solo errores
- `access.log`: Requests HTTP
- `exceptions.log`: Excepciones no capturadas

**Ver logs en tiempo real**:
```bash
# Desarrollo local
tail -f logs/combined.log

# Docker Compose
docker-compose logs -f app

# Filtrar errores
docker-compose logs -f app | grep ERROR
```

### Métricas del Sistema

**Endpoint**:
```bash
curl http://localhost:8080/metrics
```

**Métricas disponibles**:
- Total de requests
- Success/error rate
- Requests por endpoint
- Uptime del sistema
- Uso de memoria
- CPU load

**Dashboard**:
```
http://localhost:8080/metrics
```
(Requiere login como admin)

---

## 🧪 Pruebas

### Estructura de Tests

```
tests/
├── setup.js                    # Configuración global
├── unit/
│   └── helpers.test.js        # Tests de helpers
└── integration/
    └── auth.test.js           # Tests de autenticación
```

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Con cobertura
npm run test:ci

# Solo unitarios
npm run test:unit

# Solo integración
npm run test:integration

# Watch mode (desarrollo)
npm run test:watch
```

### Cobertura de Código

**Ver reporte**:
```bash
npm test
# Abre coverage/lcov-report/index.html
```

**Thresholds mínimos**:
- Branches: 10%
- Functions: 10%
- Lines: 10%
- Statements: 10%

### Crear Nuevos Tests

**Ejemplo test unitario**:
```javascript
// tests/unit/ejemplo.test.js
const { describe, test, expect } = require('@jest/globals');

describe('Mi Función', () => {
  test('debe hacer algo', () => {
    expect(1 + 1).toBe(2);
  });
});
```

**Ejemplo test de integración**:
```javascript
// tests/integration/ejemplo.test.js
const request = require('supertest');
const app = require('../../app');

describe('POST /api/endpoint', () => {
  test('debe responder 200', async () => {
    const response = await request(app)
      .post('/api/endpoint')
      .send({ data: 'test' });
    
    expect(response.status).toBe(200);
  });
});
```

---

## 🏗️ Arquitectura

### Componentes

```
┌─────────────────────────────────────────┐
│         GitHub Actions CI/CD            │
│  (Build, Test, Lint, Deploy)           │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         Docker Registry                 │
│  (Imágenes de la aplicación)           │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         Docker Compose                  │
│  ┌─────────────┐  ┌─────────────┐     │
│  │   MongoDB   │  │  AppCenar   │     │
│  │   (DB)      │◄─┤   (Node.js) │     │
│  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         Monitoring & Logs               │
│  - Winston Logs                         │
│  - Métricas de Sistema                 │
│  - Health Checks                        │
└─────────────────────────────────────────┘
```

### Tecnologías

**Backend**:
- Node.js 18+
- Express 4
- MongoDB + Mongoose

**DevOps**:
- Docker & Docker Compose
- GitHub Actions
- Jest (Testing)
- ESLint (Linting)
- Winston (Logging)

**Monitoreo**:
- Health checks personalizados
- Sistema de métricas propio
- Logs estructurados

---

## 📝 Comandos Útiles

### Docker

```bash
# Build imagen
docker build -t appcenar:latest .

# Correr contenedor
docker run -p 8080:8080 --env-file .env appcenar:latest

# Ver logs
docker logs -f appcenar-app

# Acceder al contenedor
docker exec -it appcenar-app sh

# Limpiar todo
docker-compose down -v
```

### NPM Scripts

```bash
npm start           # Producción
npm run dev         # Desarrollo (nodemon)
npm run test        # Tests
npm run test:ci     # Tests para CI
npm run lint        # Linter
npm run lint:fix    # Arreglar linting
```

### MongoDB

```bash
# Acceder a MongoDB en Docker
docker-compose exec mongodb mongosh

# Backup
docker-compose exec mongodb mongodump --out /backup

# Restore
docker-compose exec mongodb mongorestore /backup
```

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

