# Gestión de Clientes - Backend

Backend NestJS para Eglow Studio - Gestión de Clientes.

- **Backend:** http://localhost:4000
- **Swagger:** http://localhost:4000/api/docs
- **Frontend:** http://localhost:3000

---

## Requisitos previos

- [Node.js 18+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- npm 9+

---

## Instalación y arranque (primera vez)

### Paso 1: Levantar PostgreSQL con Docker

```bash
cd gestion-clientes-backend
docker compose up -d
```

Verificar que el contenedor está corriendo:
```bash
docker ps
# Debe mostrar: gestion_clientes_db
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Configurar variables de entorno

```bash
cp .env.example .env
```

El `.env` ya viene configurado para desarrollo local. No hace falta cambiar nada.

### Paso 4: Aplicar migraciones y seed

```bash
npm run db:setup
```

Este comando:
1. Crea las tablas en PostgreSQL via Prisma Migrate
2. Inserta 3 clientes de ejemplo (seed)

### Paso 5: Arrancar el servidor

```bash
npm run start:dev
```

El servidor arranca en modo watch (recarga automática al cambiar código).

---

## Arranque normal (después de la primera vez)

```bash
# Terminal 1 - Asegurarse que Docker está corriendo
docker compose up -d

# Terminal 2 - Arrancar backend
npm run start:dev
```

---

## Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `npm run start:dev` | Servidor en modo desarrollo (watch) |
| `npm run build` | Compilar TypeScript |
| `npm run start:prod` | Servidor en producción |
| `npm run seed` | Reinsertar datos de ejemplo |
| `npm run prisma:studio` | Abrir Prisma Studio (GUI base de datos) |
| `npm run prisma:migrate` | Crear nueva migración |
| `docker compose up -d` | Levantar PostgreSQL |
| `docker compose down` | Parar PostgreSQL |
| `docker compose down -v` | Parar y borrar datos |

---

## Estructura del proyecto

```
gestion-clientes-backend/
├── src/
│   ├── main.ts                        # Entry point, Swagger, CORS, pipes
│   ├── app.module.ts                  # Módulo raíz
│   ├── prisma/
│   │   ├── prisma.service.ts          # Servicio Prisma (conexión DB)
│   │   └── prisma.module.ts           # Módulo global Prisma
│   ├── clientes/
│   │   ├── clientes.module.ts
│   │   ├── clientes.controller.ts     # Rutas HTTP
│   │   ├── clientes.service.ts        # Lógica de negocio
│   │   ├── dto/
│   │   │   ├── create-cliente.dto.ts  # Validación creación
│   │   │   ├── update-cliente.dto.ts  # Validación actualización
│   │   │   └── query-cliente.dto.ts   # Parámetros de búsqueda
│   │   └── entities/
│   │       └── cliente.entity.ts      # Tipo de respuesta Swagger
│   └── common/
│       └── filters/
│           └── http-exception.filter.ts  # Manejo global de errores
├── prisma/
│   ├── schema.prisma                  # Modelo de datos
│   └── seed.ts                        # Datos de ejemplo
├── docker-compose.yml
├── .env                               # Variables locales (no commitear)
├── .env.example                       # Plantilla de variables
├── API_CONTRACT.md                    # Contrato de API completo
└── FRONTEND_CHANGES.md                # Guía de cambios en el frontend
```

---

## Conexión con el frontend

Ver [FRONTEND_CHANGES.md](./FRONTEND_CHANGES.md) para instrucciones detalladas sobre cómo adaptar el frontend para usar este backend.

Resumen:
1. Crear `.env.local` en el frontend con `NEXT_PUBLIC_API_URL=http://localhost:4000`
2. Crear `lib/api.ts` con el cliente HTTP
3. Reemplazar llamadas a `mock-data.ts` por llamadas a la API

---

## Troubleshooting

**Error: `ECONNREFUSED 5432`**
- Docker no está corriendo o el contenedor no arrancó
- Solución: `docker compose up -d` y esperar 10 segundos

**Error: `PrismaClientInitializationError`**
- La base de datos no existe o las migraciones no se aplicaron
- Solución: `npm run db:setup`

**Error: `Port 4000 already in use`**
- Otro proceso usa el puerto 4000
- Solución: `lsof -i :4000` para ver qué proceso es, o cambiar `PORT` en `.env`

**Error en seed: `unique constraint failed`**
- Ya existen datos del seed anterior
- El seed hace `deleteMany()` primero, así que esto no debería pasar
- Solución: `npm run seed` de nuevo
