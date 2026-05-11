# Rüf Arquitectura

Sitio web corporativo premium para un estudio de arquitectura y diseño de interiores, desarrollado con una arquitectura full-stack moderna. El proyecto incluye frontend público, panel administrativo protegido, API REST, persistencia en PostgreSQL y subida de imágenes a Cloudinary.

## Preview

```text
https://ruf-arquitectura.vercel.app/
```

## Sobre El Proyecto

Rüf Arquitectura es una plataforma web profesional pensada para transmitir calidad visual, confianza y conversión comercial.

Incluye:

- Landing page corporativa responsive.
- Galería pública de proyectos.
- Detalle individual de proyectos.
- Página de servicios de arquitectura.
- Testimonios dinámicos.
- Agenda pública con disponibilidad real.
- Panel administrativo protegido con JWT.
- Gestión de proyectos, testimonios, agenda, categorías y colaboradores.
- Subida de imágenes reales a Cloudinary con optimización automática.
- API backend con PostgreSQL y Entity Framework Core.

## Stack Tecnológico

### Frontend

- Next.js 16
- React
- Tailwind CSS
- next/image
- Fetch API
- ESLint

### Backend

- ASP.NET Core 8
- C#
- Minimal APIs
- Entity Framework Core
- PostgreSQL
- JWT Authentication
- Swagger

### Infraestructura Y Servicios

- Cloudinary para gestión de imágenes.
- Vercel para deploy del frontend.
- Render, Railway o VPS para deploy del backend.
- PostgreSQL como base de datos externa.

## Features

### Sitio Público

- Hero section premium.
- Presentación institucional.
- Portfolio visual de proyectos.
- Filtros por categoría.
- Página de detalle de proyecto.
- Bloque editable por proyecto de “¿qué incluye?”.
- Página `/arquitectura` con servicios, alcance y llamada a contacto.
- Testimonios de clientes.
- Agenda pública con horarios disponibles.
- Diseño responsive completo.
- Imágenes optimizadas con `next/image`.

### Panel Administrativo

- Login real con JWT.
- Gestión de proyectos.
- Gestión editable del bloque “¿qué incluye?” por proyecto.
- Gestión de testimonios.
- Gestión de agenda.
- Gestión de categorías.
- Gestión de colaboradores.
- Roles básicos: `admin` y `colaborador`.
- Upload protegido de imágenes a Cloudinary.
- Selección múltiple de imágenes para proyectos.
- Optimización automática de JPG/PNG antes de subir para evitar rechazos por peso o dimensiones.
- URLs de imágenes guardadas en PostgreSQL.

### Backend API

- API REST con Minimal APIs.
- Persistencia con PostgreSQL.
- Migraciones con Entity Framework Core.
- Autenticación JWT.
- Endpoints públicos y protegidos.
- Upload `multipart/form-data`.
- Integración server-side con Cloudinary.
- Migraciones para proyectos, imágenes, categorías, agenda, usuarios, testimonios y etapas incluidas por proyecto.
- Swagger en entorno de desarrollo.

## Arquitectura Del Proyecto

```text
ruf-arquitectura/
├── ruf-frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── data/
│   │   └── services/
│   ├── public/
│   ├── package.json
│   └── next.config.mjs
│
├── ruf-backend/
│   ├── RufApi/
│   │   ├── Data/
│   │   ├── DTOs/
│   │   ├── Migrations/
│   │   ├── Models/
│   │   ├── Program.cs
│   │   └── appsettings.Development.json
│   └── RufBackend.sln
│
├── ruf.code-workspace
└── README.md
```

## Variables Y Secretos

En desarrollo, los secretos del backend se guardan con `dotnet user-secrets`.

Claves usadas:

```text
Cloudinary:CloudName
Cloudinary:ApiKey
Cloudinary:ApiSecret
Jwt:Key
```

En producción deben configurarse como variables de entorno o secretos del proveedor de deploy.

En Render se pueden usar las variables con doble guion bajo:

```text
Cloudinary__CloudName
Cloudinary__ApiKey
Cloudinary__ApiSecret
Jwt__Key
ConnectionStrings__DefaultConnection
```

El backend también reconoce estas variables de Cloudinary:

```text
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

Importante: `ApiKey` y `ApiSecret` deben pertenecer a la misma fila/cuenta en Cloudinary. Si se mezclan, Cloudinary responde `Invalid Signature` al subir imágenes.

Nunca se deben commitear:

- API keys.
- API secrets.
- JWT secrets reales.
- Contraseñas.
- Archivos `.env` locales.

## Correr El Proyecto

### Backend

Desde la raíz del repo:

```bash
dotnet run --project ruf-backend/RufApi --launch-profile http
```

API:

```text
http://localhost:5000
```

Swagger:

```text
http://localhost:5000/swagger
```

### Frontend

```bash
cd ruf-frontend
npm run dev
```

Frontend:

```text
http://localhost:3000
```

## Comandos Útiles

### Backend

```bash
dotnet build ruf-backend/RufBackend.sln
```

Crear migración:

```bash
dotnet ef migrations add NombreMigracion --project ruf-backend/RufApi --startup-project ruf-backend/RufApi
```

Aplicar migraciones:

```bash
dotnet ef database update --project ruf-backend/RufApi --startup-project ruf-backend/RufApi
```

Aplicar migraciones contra producción usando una conexión externa:

```bash
RUF_DB_CONNECTION='Host=HOST;Port=5432;Database=DB;Username=USER;Password=PASSWORD;SSL Mode=Require;Trust Server Certificate=true' \
dotnet ef database update \
  --project ruf-backend/RufApi \
  --startup-project ruf-backend/RufApi
```

### Frontend

```bash
cd ruf-frontend
npm run lint
npm run build
```

## Admin

Usuario inicial de desarrollo:

```text
email: admin@ruf.com
password: ruf123
```

Este usuario se crea como seed inicial si no existen usuarios en la base.

Importante: cambiar la contraseña demo antes de producción.

## Deploy Recomendado

- Frontend: Vercel.
- Backend: Render, Railway o VPS.
- Base de datos: PostgreSQL externo.
- Imágenes: Cloudinary.

Para producción:

- Configurar `NEXT_PUBLIC_API_URL` en el frontend.
- Configurar connection string del backend.
- Configurar `Jwt:Key` seguro.
- Configurar credenciales de Cloudinary.
- Verificar que `Cloudinary__ApiKey` y `Cloudinary__ApiSecret` sean pareja.
- Habilitar CORS para el dominio real del frontend.

## Estado Actual

- Frontend público conectado a API.
- Admin conectado a API real.
- PostgreSQL como persistencia principal.
- Cloudinary integrado para uploads.
- Optimización automática de imágenes en el frontend antes de subir.
- Auth real con JWT.
- User secrets configurado para desarrollo local.



Gracias por ver, Franco.
