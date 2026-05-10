# Rüf Arquitectura

Sitio web corporativo premium para un estudio de arquitectura y diseño de interiores, desarrollado con una arquitectura full-stack moderna. El proyecto incluye frontend público, panel administrativo protegido, API REST, persistencia en PostgreSQL y subida de imágenes a Cloudinary.

## Preview

```text
[(https://ruf-arquitectura.vercel.app/)]
```

## Sobre El Proyecto

Rüf Arquitectura es una plataforma web profesional pensada para transmitir calidad visual, confianza y conversión comercial.

Incluye:

- Landing page corporativa responsive.
- Galería pública de proyectos.
- Detalle individual de proyectos.
- Testimonios dinámicos.
- Agenda pública con disponibilidad real.
- Panel administrativo protegido con JWT.
- Gestión de proyectos, testimonios, agenda, categorías y colaboradores.
- Subida de imágenes reales a Cloudinary.
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
- Testimonios de clientes.
- Agenda pública con horarios disponibles.
- Diseño responsive completo.
- Imágenes optimizadas con `next/image`.

### Panel Administrativo

- Login real con JWT.
- Gestión de proyectos.
- Gestión de testimonios.
- Gestión de agenda.
- Gestión de categorías.
- Gestión de colaboradores.
- Roles básicos: `admin` y `colaborador`.
- Upload protegido de imágenes a Cloudinary.
- URLs de imágenes guardadas en PostgreSQL.

### Backend API

- API REST con Minimal APIs.
- Persistencia con PostgreSQL.
- Migraciones con Entity Framework Core.
- Autenticación JWT.
- Endpoints públicos y protegidos.
- Upload `multipart/form-data`.
- Validación de tipo de archivo.
- Límite de tamaño de imagen de 10MB.
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
- Habilitar CORS para el dominio real del frontend.

## Estado Actual

- Frontend público conectado a API.
- Admin conectado a API real.
- PostgreSQL como persistencia principal.
- Cloudinary integrado para uploads.
- Auth real con JWT.
- User secrets configurado para desarrollo local.



Gracias por ver, Franco.
