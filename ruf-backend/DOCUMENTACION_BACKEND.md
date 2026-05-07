# Documentacion del backend

Este documento explica el backend actual de `rüf arquitectura`: que hace, como esta organizado, como se ejecuta y que partes hay que tocar cuando avancemos hacia base de datos real, autenticacion y deploy.

## 1. Resumen

El backend esta creado con `ASP.NET Core 8` y vive separado del frontend dentro de:

```text
ruf-backend/
├── RufApi/
│   ├── Controllers/
│   ├── Data/
│   ├── DTOs/
│   ├── Models/
│   ├── Program.cs
│   ├── RufApi.csproj
│   └── ...
└── RufBackend.sln
```

Por ahora es una API funcional en memoria. Eso significa que:

- la API responde endpoints reales;
- Swagger funciona;
- hay datos iniciales cargados;
- se pueden crear, editar y borrar registros;
- los datos se pierden cuando se reinicia el servidor.

Esto esta bien para la etapa actual porque permite conectar el frontend y validar flujos antes de sumar PostgreSQL.

## 2. Como correrlo

Desde la raiz del monorepo:

```bash
dotnet run --project ruf-backend/RufApi --launch-profile http
```

La API corre en:

```text
http://localhost:5000
```

Swagger queda disponible en:

```text
http://localhost:5000/swagger
```

Health check:

```text
GET http://localhost:5000/api/health
```

Respuesta esperada:

```json
{
  "status": "ok"
}
```

## 3. Archivos principales

### `RufBackend.sln`

Archivo de solucion de .NET.

Sirve para que `dotnet build`, Visual Studio o VSCode sepan que proyectos forman parte del backend.

Ubicacion:

```text
ruf-backend/RufBackend.sln
```

### `RufApi.csproj`

Archivo del proyecto ASP.NET Core.

Define:

- framework usado: `net8.0`;
- dependencias NuGet;
- configuracion base del proyecto.

Ubicacion:

```text
ruf-backend/RufApi/RufApi.csproj
```

### `Program.cs`

Es el punto de entrada de la API.

Actualmente contiene:

- configuracion de servicios;
- configuracion de CORS;
- configuracion de Swagger;
- definicion de endpoints;
- arranque de la aplicacion.

Ubicacion:

```text
ruf-backend/RufApi/Program.cs
```

## 4. Estructura por carpetas

### `Models/`

Contiene los modelos principales del negocio.

Ejemplos:

- `Proyecto`
- `Categoria`
- `Testimonio`
- `Reunion`
- `Bloqueo`

Los modelos representan entidades del sistema. Son los datos que existen dentro del dominio de la aplicacion.

Ejemplo conceptual:

```csharp
public sealed record Categoria(string Id, string Nombre);
```

Esto significa que una categoria tiene:

- `Id`
- `Nombre`

### `DTOs/`

Contiene los contratos de entrada de la API.

DTO significa `Data Transfer Object`.

En este proyecto los DTOs se usan para recibir datos desde el frontend cuando se hace un `POST`, `PUT` o `PATCH`.

Ejemplos:

- `ProyectoRequest`
- `CategoriaRequest`
- `TestimonioRequest`
- `ReunionRequest`
- `BloqueoRequest`
- `EstadoReunionRequest`

Diferencia importante:

- `Model`: representa una entidad interna del sistema.
- `DTO`: representa los datos que entran o salen por la API.

Aunque ahora son parecidos, separarlos desde temprano ayuda mucho cuando despues agreguemos validaciones, base de datos y seguridad.

### `Data/`

Contiene la fuente de datos actual.

Hoy existe:

```text
Data/InMemoryDatabase.cs
```

Este archivo simula una base de datos usando listas en memoria:

- `Categorias`
- `Proyectos`
- `Testimonios`
- `HorariosBase`
- `Reuniones`
- `Bloqueos`

Tambien incluye funciones auxiliares:

- `Slugify`: convierte texto en un id limpio, por ejemplo `Casa Moderna` -> `casa-moderna`.
- `EnsureUniqueId`: evita ids repetidos agregando sufijos si hace falta.

Importante: cuando conectemos PostgreSQL, esta clase va a ser reemplazada o complementada por un `DbContext` de Entity Framework Core.

### `Controllers/`

La carpeta existe, pero por ahora esta vacia.

Esto es intencional. El backend actual usa `Minimal APIs`, por eso los endpoints estan definidos en `Program.cs`.

Mas adelante hay dos caminos validos:

- mantener Minimal APIs y separar endpoints por archivos;
- migrar a controladores dentro de `Controllers/`.

Para un proyecto que va a crecer con admin, autenticacion y base de datos, probablemente convenga pasar luego a una estructura mas separada por controladores o por features.

## 5. Configuracion de servicios

En `Program.cs` se registran los servicios principales.

### Base en memoria

```csharp
builder.Services.AddSingleton<InMemoryDatabase>();
```

Esto registra una unica instancia de `InMemoryDatabase` mientras la API esta corriendo.

Por eso, si creas un proyecto por API, queda disponible mientras el servidor siga encendido. Pero si reinicias el backend, vuelve a los datos iniciales.

### CORS

```csharp
.WithOrigins("http://localhost:3000", "http://127.0.0.1:3000")
```

CORS permite que el frontend Next.js, corriendo en `localhost:3000`, pueda llamar al backend en `localhost:5000`.

Sin CORS, el navegador bloquearia requests del frontend hacia la API.

Cuando deployemos, habra que agregar el dominio real de Vercel, por ejemplo:

```text
https://ruf-arquitectura.vercel.app
```

### Swagger

Swagger sirve para ver y probar la API desde el navegador.

En desarrollo se abre en:

```text
http://localhost:5000/swagger
```

## 6. Endpoints disponibles

### Health

Sirve para verificar que la API esta viva.

```text
GET /api/health
```

### Proyectos

Grupo:

```text
/api/proyectos
```

Endpoints:

```text
GET    /api/proyectos
GET    /api/proyectos/{id}
POST   /api/proyectos
PUT    /api/proyectos/{id}
DELETE /api/proyectos/{id}
```

Filtros disponibles en `GET /api/proyectos`:

```text
?categoria=casa
?estado=publicado
?destacado=true
```

Ejemplo:

```text
GET /api/proyectos?estado=publicado&destacado=true
```

Uso esperado:

- home: proyectos destacados publicados;
- pagina de proyectos: proyectos publicados;
- admin: todos los proyectos, incluyendo borradores.

### Categorias

Grupo:

```text
/api/categorias
```

Endpoints:

```text
GET    /api/categorias
POST   /api/categorias
PUT    /api/categorias/{id}
DELETE /api/categorias/{id}
```

Uso esperado:

- filtros de proyectos;
- selector de categoria en formularios admin;
- administracion de categorias.

### Testimonios

Grupo:

```text
/api/testimonios
```

Endpoints:

```text
GET    /api/testimonios
GET    /api/testimonios/{id}
POST   /api/testimonios
PUT    /api/testimonios/{id}
DELETE /api/testimonios/{id}
```

Filtros disponibles:

```text
?estado=activo
?mostrarEnHome=true
```

Ejemplo:

```text
GET /api/testimonios?estado=activo&mostrarEnHome=true
```

Regla actual:

- `estrellas` debe estar entre `1` y `5`.

Si no cumple, la API devuelve `400 Bad Request`.

### Agenda

Grupo:

```text
/api/agenda
```

Endpoints:

```text
GET    /api/agenda/horarios-base
GET    /api/agenda/horarios-disponibles?fecha=2026-05-10
GET    /api/agenda/reuniones
POST   /api/agenda/reuniones
PATCH  /api/agenda/reuniones/{id}/estado
DELETE /api/agenda/reuniones/{id}
GET    /api/agenda/bloqueos
POST   /api/agenda/bloqueos
DELETE /api/agenda/bloqueos/{id}
```

Reglas de disponibilidad:

- una reunion `pendiente` ocupa horario;
- una reunion `confirmada` ocupa horario;
- una reunion `cancelada` no ocupa horario;
- un bloqueo manual ocupa horario;
- solo se aceptan horarios que existen en `HorariosBase`.

Ejemplo:

```text
GET /api/agenda/horarios-disponibles?fecha=2026-05-10
```

Respuesta esperada:

```json
[
  "12:00:00",
  "17:00:00",
  "18:00:00"
]
```

## 7. Como fluye una request

Ejemplo: crear una reunion.

1. El frontend envia un `POST` a:

```text
/api/agenda/reuniones
```

2. El body llega como `ReunionRequest`.

3. La API verifica que el horario exista en `HorariosBase`.

4. La API verifica que no haya otra reunion pendiente o confirmada en la misma fecha y hora.

5. La API verifica que no haya un bloqueo en la misma fecha y hora.

6. Si todo esta bien, crea una `Reunion` con estado `pendiente`.

7. Devuelve `201 Created`.

Si el horario ya esta ocupado, devuelve:

```text
409 Conflict
```

## 8. Estado actual vs estado futuro

### Estado actual

El backend actual esta perfecto para:

- probar endpoints;
- conectar el frontend;
- reemplazar mocks;
- validar reglas de agenda;
- preparar el camino a base de datos.

No esta pensado todavia para produccion real porque:

- no guarda datos de forma persistente;
- no tiene autenticacion;
- no tiene autorizacion admin;
- no tiene validaciones profundas;
- no tiene subida real de imagenes;
- no tiene PostgreSQL.

### Proximo paso recomendado

El siguiente paso tecnico deberia ser:

1. conectar el frontend a la API usando una variable:

```text
NEXT_PUBLIC_API_URL=http://localhost:5000
```

2. crear servicios en frontend, por ejemplo:

```text
ruf-frontend/src/services/api.js
```

3. reemplazar mocks de a poco:

- primero proyectos;
- despues testimonios;
- despues agenda;
- al final admin.

4. agregar PostgreSQL con Entity Framework Core.

5. agregar autenticacion para `/admin`.

## 9. Cuando agreguemos PostgreSQL

La estructura podria evolucionar asi:

```text
RufApi/
├── Controllers/
├── Data/
│   ├── RufDbContext.cs
│   └── Migrations/
├── DTOs/
├── Models/
├── Services/
├── Program.cs
└── appsettings.json
```

`InMemoryDatabase` dejaria de ser la fuente principal.

En su lugar tendriamos:

- `RufDbContext`;
- tablas en PostgreSQL;
- migraciones;
- repositorios o servicios;
- connection string en variables de entorno.

## 10. Deploy recomendado

Para este proyecto recomiendo:

```text
Frontend: Vercel
Backend: Render o Railway
Base de datos: PostgreSQL gestionado
```

### Vercel

Configurar root directory:

```text
ruf-frontend
```

Variables:

```text
NEXT_PUBLIC_API_URL=https://url-real-del-backend
```

### Render o Railway

Configurar el backend apuntando a:

```text
ruf-backend/RufApi
```

Comando de build aproximado:

```bash
dotnet publish -c Release
```

Comando de start dependera del proveedor, pero conceptualmente ejecuta la DLL publicada.

Variables futuras:

```text
ASPNETCORE_ENVIRONMENT=Production
DATABASE_URL=...
```

### PostgreSQL

Conviene que este separado del backend.

Ventajas:

- backups mas faciles;
- escalado independiente;
- menos riesgo al redeployar backend;
- mejor mantenimiento a futuro.

## 11. Que no hay que tocar por ahora

Para no romper el frontend actual:

- no mover `src/` fuera de `ruf-frontend`;
- no cambiar imports `@/...`;
- no borrar mocks hasta que el frontend consuma la API;
- no mezclar `package.json` del frontend con archivos `.csproj`;
- no poner `node_modules` ni `bin/obj` en git.

## 12. Checklist para trabajar dia a dia

Levantar frontend:

```bash
cd ruf-frontend
nvm use
npm run dev
```

Levantar backend:

```bash
dotnet run --project ruf-backend/RufApi --launch-profile http
```

Probar backend:

```text
http://localhost:5000/swagger
```

Probar frontend:

```text
http://localhost:3000
```

Compilar frontend:

```bash
cd ruf-frontend
nvm use
npm run build
```

Compilar backend:

```bash
cd ruf-backend
dotnet build RufBackend.sln --no-restore
```

## 13. Glosario rapido

API:

Sistema que expone endpoints para que otro sistema, como el frontend, pueda pedir o enviar datos.

Endpoint:

Una URL especifica de la API, por ejemplo `/api/proyectos`.

DTO:

Objeto usado para recibir o devolver datos por API.

Model:

Objeto que representa una entidad del negocio.

CORS:

Regla del navegador que controla si un frontend puede llamar a un backend en otro puerto o dominio.

Swagger:

Interfaz visual para probar endpoints de la API.

InMemoryDatabase:

Base de datos falsa en memoria. Sirve para desarrollo inicial, pero no persiste datos.

PostgreSQL:

Base de datos real recomendada para produccion.
