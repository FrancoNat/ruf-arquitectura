# ruf

Monorepo de `rüf arquitectura` con frontend y backend separados.

## Estructura

```text
ruf/
├── ruf-frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
└── ruf-backend/
    ├── RufApi/
    │   ├── Data/
    │   ├── Models/
    │   ├── Program.cs
    │   └── ...
    └── RufBackend.sln
```

## Frontend

```bash
cd ruf-frontend
npm run dev
```

Abre `http://localhost:3000`.

## Backend

```bash
dotnet run --project ruf-backend/RufApi --launch-profile http
```

Swagger abre en `http://localhost:5000/swagger`.

## Notas

- El frontend todavía usa datos mock/locales.
- El backend expone la API en memoria para proyectos, categorías, testimonios y agenda.
- No hay referencias cruzadas obligatorias entre frontend y backend todavía.
