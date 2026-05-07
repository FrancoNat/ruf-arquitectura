# Backend ruf arquitectura

API ASP.NET Core 8 para reemplazar los datos mock del frontend.

## Ejecutar

```bash
dotnet run --project ruf-backend/RufApi --launch-profile http
```

Swagger queda disponible en:

- `http://localhost:5000/swagger`

Health check:

- `GET http://localhost:5000/api/health`

## Recursos iniciales

- `GET /api/proyectos`
- `GET /api/proyectos/{id}`
- `POST /api/proyectos`
- `PUT /api/proyectos/{id}`
- `DELETE /api/proyectos/{id}`
- `GET /api/categorias`
- `POST /api/categorias`
- `PUT /api/categorias/{id}`
- `DELETE /api/categorias/{id}`
- `GET /api/testimonios`
- `GET /api/testimonios/{id}`
- `POST /api/testimonios`
- `PUT /api/testimonios/{id}`
- `DELETE /api/testimonios/{id}`
- `GET /api/agenda/horarios-base`
- `GET /api/agenda/horarios-disponibles?fecha=2026-05-10`
- `GET /api/agenda/reuniones`
- `POST /api/agenda/reuniones`
- `PATCH /api/agenda/reuniones/{id}/estado`
- `DELETE /api/agenda/reuniones/{id}`
- `GET /api/agenda/bloqueos`
- `POST /api/agenda/bloqueos`
- `DELETE /api/agenda/bloqueos/{id}`

Los datos viven en memoria por ahora, con semillas equivalentes a los mocks actuales del frontend.
