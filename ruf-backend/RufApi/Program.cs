using Microsoft.EntityFrameworkCore;
using RufApi.Data;
using RufApi.DTOs;
using RufApi.Models;

var builder = WebApplication.CreateBuilder(args);

const string FrontendCorsPolicy = "FrontendCorsPolicy";

builder.Services.AddSingleton<InMemoryDatabase>();
builder.Services.AddDbContext<RufDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
    {
        policy
            .WithOrigins("http://localhost:3000", "http://127.0.0.1:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    await SeedProyectoDataAsync(app.Services, app.Logger);
    await SeedTestimonioDataAsync(app.Services, app.Logger);
    await SeedCategoriaDataAsync(app.Services, app.Logger);
    await SeedAgendaDataAsync(app.Services, app.Logger);
}

app.UseCors(FrontendCorsPolicy);

app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }))
    .WithName("HealthCheck")
    .WithOpenApi();

var proyectos = app.MapGroup("/api/proyectos").WithTags("Proyectos");

proyectos.MapGet("/", async (
    RufDbContext db,
    string? categoria,
    string? estado,
    bool? destacado) =>
{
    var query = db.Proyectos
        .AsNoTracking()
        .Include(proyecto => proyecto.ImagenesPersistidas)
        .AsQueryable();

    if (!string.IsNullOrWhiteSpace(categoria))
    {
        query = query.Where(proyecto => proyecto.Categoria == categoria);
    }

    if (!string.IsNullOrWhiteSpace(estado))
    {
        query = query.Where(proyecto => proyecto.Estado == estado);
    }

    if (destacado is not null)
    {
        query = query.Where(proyecto => proyecto.Destacado == destacado);
    }

    var proyectos = await query
        .OrderByDescending(proyecto => proyecto.CreatedAt)
        .ThenBy(proyecto => proyecto.Titulo)
        .ToListAsync();

    return Results.Ok(proyectos.Select(MapProyectoResponse));
});

proyectos.MapGet("/{id}", async (RufDbContext db, string id) =>
{
    var normalized = id.Trim().ToLowerInvariant();
    var proyecto = await db.Proyectos
        .AsNoTracking()
        .Include(item => item.ImagenesPersistidas)
        .FirstOrDefaultAsync(item => item.Id == id || item.Slug == normalized);

    return proyecto is null ? Results.NotFound() : Results.Ok(MapProyectoResponse(proyecto));
});

proyectos.MapPost("/", async (RufDbContext db, ProyectoRequest request) =>
{
    var baseSlug = InMemoryDatabase.Slugify(request.Slug ?? request.Titulo);
    var slug = await EnsureUniqueProyectoSlugAsync(db, baseSlug);
    var now = DateTime.UtcNow;
    var alt = BuildProyectoAlt(request.Alt, request.Titulo);

    var proyecto = new Proyecto
    {
        Id = slug,
        Slug = slug,
        Titulo = request.Titulo,
        Categoria = request.Categoria,
        DescripcionCorta = request.DescripcionCorta,
        DescripcionLarga = request.DescripcionLarga,
        Ubicacion = request.Ubicacion,
        Anio = request.Anio,
        Superficie = request.Superficie,
        Estado = request.Estado,
        Destacado = request.Destacado,
        ImagenPrincipal = request.ImagenPrincipal,
        Alt = alt,
        CreatedAt = now,
        UpdatedAt = now,
        ImagenesPersistidas = BuildProyectoImagenes(request.Imagenes, alt)
    };

    db.Proyectos.Add(proyecto);
    await db.SaveChangesAsync();

    return Results.Created($"/api/proyectos/{proyecto.Slug}", MapProyectoResponse(proyecto));
});

proyectos.MapPut("/{id}", async (RufDbContext db, string id, ProyectoRequest request) =>
{
    var normalized = id.Trim().ToLowerInvariant();
    var proyecto = await db.Proyectos
        .Include(item => item.ImagenesPersistidas)
        .FirstOrDefaultAsync(item => item.Id == id || item.Slug == normalized);

    if (proyecto is null)
    {
        return Results.NotFound();
    }

    var requestedSlug = InMemoryDatabase.Slugify(request.Slug ?? proyecto.Slug);
    var slug = requestedSlug == proyecto.Slug
        ? proyecto.Slug
        : await EnsureUniqueProyectoSlugAsync(db, requestedSlug, proyecto.Id);
    var alt = BuildProyectoAlt(request.Alt, request.Titulo);

    proyecto.Slug = slug;
    proyecto.Titulo = request.Titulo;
    proyecto.Categoria = request.Categoria;
    proyecto.DescripcionCorta = request.DescripcionCorta;
    proyecto.DescripcionLarga = request.DescripcionLarga;
    proyecto.Ubicacion = request.Ubicacion;
    proyecto.Anio = request.Anio;
    proyecto.Superficie = request.Superficie;
    proyecto.Estado = request.Estado;
    proyecto.Destacado = request.Destacado;
    proyecto.ImagenPrincipal = request.ImagenPrincipal;
    proyecto.Alt = alt;
    proyecto.UpdatedAt = DateTime.UtcNow;
    proyecto.ImagenesPersistidas.Clear();
    proyecto.ImagenesPersistidas.AddRange(BuildProyectoImagenes(request.Imagenes, alt));

    await db.SaveChangesAsync();

    return Results.Ok(MapProyectoResponse(proyecto));
});

proyectos.MapDelete("/{id}", async (RufDbContext db, string id) =>
{
    var normalized = id.Trim().ToLowerInvariant();
    var proyecto = await db.Proyectos
        .FirstOrDefaultAsync(item => item.Id == id || item.Slug == normalized);

    if (proyecto is null)
    {
        return Results.NotFound();
    }

    db.Proyectos.Remove(proyecto);
    await db.SaveChangesAsync();

    return Results.NoContent();
});

var categorias = app.MapGroup("/api/categorias").WithTags("Categorias");

categorias.MapGet("/", async (RufDbContext db) =>
{
    var categorias = await db.Categorias
        .AsNoTracking()
        .OrderBy(categoria => categoria.Nombre)
        .ToListAsync();

    return Results.Ok(categorias.Select(MapCategoriaResponse));
});

categorias.MapPost("/", async (RufDbContext db, CategoriaRequest request) =>
{
    var validationError = ValidateCategoriaRequest(request);
    if (validationError is not null)
    {
        return Results.BadRequest(new { error = validationError });
    }

    var baseId = InMemoryDatabase.Slugify(request.Id ?? request.Nombre);
    var id = await EnsureUniqueCategoriaIdAsync(db, baseId);
    var nombre = request.Nombre.Trim().ToLowerInvariant();

    if (await db.Categorias.AnyAsync(categoria => categoria.Nombre == nombre))
    {
        return Results.Conflict(new { error = "esa categoría ya existe" });
    }

    var now = DateTime.UtcNow;

    var categoria = new Categoria
    {
        Id = id,
        Nombre = nombre,
        CreatedAt = now,
        UpdatedAt = now
    };

    db.Categorias.Add(categoria);
    await db.SaveChangesAsync();

    return Results.Created($"/api/categorias/{categoria.Id}", MapCategoriaResponse(categoria));
});

categorias.MapPut("/{id}", async (RufDbContext db, string id, CategoriaRequest request) =>
{
    var validationError = ValidateCategoriaRequest(request);
    if (validationError is not null)
    {
        return Results.BadRequest(new { error = validationError });
    }

    var categoria = await db.Categorias.FirstOrDefaultAsync(item => item.Id == id);
    if (categoria is null)
    {
        return Results.NotFound();
    }

    var nombre = request.Nombre.Trim().ToLowerInvariant();
    var nombreEnUso = await db.Categorias.AnyAsync(item => item.Id != id && item.Nombre == nombre);
    if (nombreEnUso)
    {
        return Results.Conflict(new { error = "esa categoría ya existe" });
    }

    categoria.Nombre = nombre;
    categoria.UpdatedAt = DateTime.UtcNow;

    await db.SaveChangesAsync();

    return Results.Ok(MapCategoriaResponse(categoria));
});

categorias.MapDelete("/{id}", async (RufDbContext db, string id) =>
{
    var categoria = await db.Categorias.FirstOrDefaultAsync(item => item.Id == id);
    if (categoria is null)
    {
        return Results.NotFound();
    }

    var categoriaEnUso = await db.Proyectos.AnyAsync(proyecto => proyecto.Categoria == categoria.Id);
    if (categoriaEnUso)
    {
        return Results.Conflict(new { error = "no se puede eliminar una categoría en uso" });
    }

    db.Categorias.Remove(categoria);
    await db.SaveChangesAsync();

    return Results.NoContent();
});

var testimonios = app.MapGroup("/api/testimonios").WithTags("Testimonios");

testimonios.MapGet("/", async (RufDbContext db, string? estado, bool? mostrarEnHome) =>
{
    var query = db.Testimonios
        .AsNoTracking()
        .AsQueryable();

    if (!string.IsNullOrWhiteSpace(estado))
    {
        query = query.Where(testimonio => testimonio.Estado == estado);
    }

    if (mostrarEnHome is not null)
    {
        query = query.Where(testimonio => testimonio.MostrarEnHome == mostrarEnHome);
    }

    var testimonios = await query
        .OrderByDescending(testimonio => testimonio.CreatedAt)
        .ThenBy(testimonio => testimonio.Nombre)
        .ToListAsync();

    return Results.Ok(testimonios.Select(MapTestimonioResponse));
});

testimonios.MapGet("/{id}", async (RufDbContext db, string id) =>
{
    var testimonio = await db.Testimonios
        .AsNoTracking()
        .FirstOrDefaultAsync(item => item.Id == id);

    return testimonio is null ? Results.NotFound() : Results.Ok(MapTestimonioResponse(testimonio));
});

testimonios.MapPost("/", async (RufDbContext db, TestimonioRequest request) =>
{
    var validationError = ValidateTestimonioRequest(request);
    if (validationError is not null)
    {
        return Results.BadRequest(new { error = validationError });
    }

    var id = await EnsureUniqueTestimonioIdAsync(
        db,
        InMemoryDatabase.Slugify(request.Nombre));
    var now = DateTime.UtcNow;

    var testimonio = new Testimonio
    {
        Id = id,
        Nombre = request.Nombre,
        TipoProyecto = request.TipoProyecto,
        Texto = request.Texto,
        Estrellas = request.Estrellas,
        Foto = request.Foto,
        Estado = request.Estado,
        MostrarEnHome = request.MostrarEnHome,
        CreatedAt = now,
        UpdatedAt = now
    };

    db.Testimonios.Add(testimonio);
    await db.SaveChangesAsync();

    return Results.Created($"/api/testimonios/{testimonio.Id}", MapTestimonioResponse(testimonio));
});

testimonios.MapPut("/{id}", async (RufDbContext db, string id, TestimonioRequest request) =>
{
    var validationError = ValidateTestimonioRequest(request);
    if (validationError is not null)
    {
        return Results.BadRequest(new { error = validationError });
    }

    var testimonio = await db.Testimonios.FirstOrDefaultAsync(item => item.Id == id);
    if (testimonio is null)
    {
        return Results.NotFound();
    }

    testimonio.Nombre = request.Nombre;
    testimonio.TipoProyecto = request.TipoProyecto;
    testimonio.Texto = request.Texto;
    testimonio.Estrellas = request.Estrellas;
    testimonio.Foto = request.Foto;
    testimonio.Estado = request.Estado;
    testimonio.MostrarEnHome = request.MostrarEnHome;
    testimonio.UpdatedAt = DateTime.UtcNow;

    await db.SaveChangesAsync();

    return Results.Ok(MapTestimonioResponse(testimonio));
});

testimonios.MapDelete("/{id}", async (RufDbContext db, string id) =>
{
    var testimonio = await db.Testimonios.FirstOrDefaultAsync(item => item.Id == id);
    if (testimonio is null)
    {
        return Results.NotFound();
    }

    db.Testimonios.Remove(testimonio);
    await db.SaveChangesAsync();

    return Results.NoContent();
});

var agenda = app.MapGroup("/api/agenda").WithTags("Agenda");

agenda.MapGet("/horarios-base", async (RufDbContext db) =>
{
    var horarios = await db.HorariosBase
        .AsNoTracking()
        .Where(horario => horario.Activo)
        .OrderBy(horario => horario.Orden)
        .ThenBy(horario => horario.Hora)
        .ToListAsync();

    return Results.Ok(horarios.Select(horario => FormatHora(horario.Hora)));
});

agenda.MapGet("/horarios-disponibles", async (RufDbContext db, DateOnly fecha) =>
{
    var horariosBase = await db.HorariosBase
        .AsNoTracking()
        .Where(horario => horario.Activo)
        .OrderBy(horario => horario.Orden)
        .ThenBy(horario => horario.Hora)
        .Select(horario => horario.Hora)
        .ToListAsync();

    var reunionesOcupadas = await db.Reuniones
        .AsNoTracking()
        .Where(reunion =>
            reunion.Fecha == fecha &&
            (reunion.Estado == "pendiente" || reunion.Estado == "confirmada"))
        .Select(reunion => reunion.Hora)
        .ToListAsync();

    var bloqueos = await db.BloqueosHorarios
        .AsNoTracking()
        .Where(bloqueo => bloqueo.Fecha == fecha)
        .Select(bloqueo => bloqueo.Hora)
        .ToListAsync();

    var ocupados = reunionesOcupadas.Concat(bloqueos).ToHashSet();

    var disponibles = horariosBase
        .Where(hora => !ocupados.Contains(hora))
        .Select(FormatHora)
        .ToList();

    return Results.Ok(disponibles);
});

agenda.MapGet("/reuniones", async (RufDbContext db, DateOnly? fecha) =>
{
    var query = db.Reuniones
        .AsNoTracking()
        .AsQueryable();

    if (fecha is not null)
    {
        query = query.Where(reunion => reunion.Fecha == fecha);
    }

    var reuniones = await query
        .OrderBy(reunion => reunion.Fecha)
        .ThenBy(reunion => reunion.Hora)
        .ToListAsync();

    return Results.Ok(reuniones.Select(MapReunionResponse));
});

agenda.MapPost("/reuniones", async (RufDbContext db, ReunionRequest request) =>
{
    var validationError = ValidateReunionRequest(request);
    if (validationError is not null)
    {
        return Results.BadRequest(new { error = validationError });
    }

    if (!await HorarioBaseActivoExisteAsync(db, request.Hora))
    {
        return Results.BadRequest(new { error = "El horario elegido no existe en la agenda base." });
    }

    if (await HorarioOcupadoAsync(db, request.Fecha, request.Hora))
    {
        return Results.Conflict(new { error = "El horario elegido ya no está disponible." });
    }

    var now = DateTime.UtcNow;
    var reunion = new Reunion
    {
        Id = Guid.NewGuid().ToString("N")[..8],
        Nombre = request.Nombre.Trim(),
        TipoProyecto = request.TipoProyecto.Trim(),
        Fecha = request.Fecha,
        Hora = request.Hora,
        Estado = "pendiente",
        CreatedAt = now,
        UpdatedAt = now
    };

    db.Reuniones.Add(reunion);
    await db.SaveChangesAsync();

    return Results.Created($"/api/agenda/reuniones/{reunion.Id}", MapReunionResponse(reunion));
});

agenda.MapPatch("/reuniones/{id}/estado", async (RufDbContext db, string id, EstadoReunionRequest request) =>
{
    if (!EstadoReunionValido(request.Estado))
    {
        return Results.BadRequest(new { error = "El estado debe ser pendiente, confirmada o cancelada." });
    }

    var reunion = await db.Reuniones.FirstOrDefaultAsync(item => item.Id == id);
    if (reunion is null)
    {
        return Results.NotFound();
    }

    reunion.Estado = request.Estado.Trim().ToLowerInvariant();
    reunion.UpdatedAt = DateTime.UtcNow;

    await db.SaveChangesAsync();

    return Results.Ok(MapReunionResponse(reunion));
});

agenda.MapDelete("/reuniones/{id}", async (RufDbContext db, string id) =>
{
    var reunion = await db.Reuniones.FirstOrDefaultAsync(item => item.Id == id);
    if (reunion is null)
    {
        return Results.NotFound();
    }

    db.Reuniones.Remove(reunion);
    await db.SaveChangesAsync();

    return Results.NoContent();
});

agenda.MapGet("/bloqueos", async (RufDbContext db, DateOnly? fecha) =>
{
    var query = db.BloqueosHorarios
        .AsNoTracking()
        .AsQueryable();

    if (fecha is not null)
    {
        query = query.Where(bloqueo => bloqueo.Fecha == fecha);
    }

    var bloqueos = await query
        .OrderBy(bloqueo => bloqueo.Fecha)
        .ThenBy(bloqueo => bloqueo.Hora)
        .ToListAsync();

    return Results.Ok(bloqueos.Select(MapBloqueoResponse));
});

agenda.MapPost("/bloqueos", async (RufDbContext db, BloqueoRequest request) =>
{
    var validationError = ValidateBloqueoRequest(request);
    if (validationError is not null)
    {
        return Results.BadRequest(new { error = validationError });
    }

    if (!await HorarioBaseActivoExisteAsync(db, request.Hora))
    {
        return Results.BadRequest(new { error = "El horario elegido no existe en la agenda base." });
    }

    if (await HorarioOcupadoAsync(db, request.Fecha, request.Hora))
    {
        return Results.Conflict(new { error = "El horario elegido ya no está disponible." });
    }

    var now = DateTime.UtcNow;
    var bloqueo = new BloqueoHorario
    {
        Id = $"b{Guid.NewGuid().ToString("N")[..8]}",
        Fecha = request.Fecha,
        Hora = request.Hora,
        Motivo = request.Motivo.Trim(),
        CreatedAt = now,
        UpdatedAt = now
    };

    db.BloqueosHorarios.Add(bloqueo);
    await db.SaveChangesAsync();

    return Results.Created($"/api/agenda/bloqueos/{bloqueo.Id}", MapBloqueoResponse(bloqueo));
});

agenda.MapDelete("/bloqueos/{id}", async (RufDbContext db, string id) =>
{
    var bloqueo = await db.BloqueosHorarios.FirstOrDefaultAsync(item => item.Id == id);
    if (bloqueo is null)
    {
        return Results.NotFound();
    }

    db.BloqueosHorarios.Remove(bloqueo);
    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.Run();

static ReunionResponse MapReunionResponse(Reunion reunion)
{
    return new ReunionResponse(
        reunion.Id,
        reunion.Nombre,
        reunion.TipoProyecto,
        reunion.Fecha,
        FormatHora(reunion.Hora),
        reunion.Estado,
        reunion.CreatedAt,
        reunion.UpdatedAt);
}

static BloqueoResponse MapBloqueoResponse(BloqueoHorario bloqueo)
{
    return new BloqueoResponse(
        bloqueo.Id,
        bloqueo.Fecha,
        FormatHora(bloqueo.Hora),
        bloqueo.Motivo,
        bloqueo.CreatedAt,
        bloqueo.UpdatedAt);
}

static string FormatHora(TimeOnly hora)
{
    return hora.ToString("HH:mm:ss");
}

static bool EstadoReunionValido(string? estado)
{
    var estadosValidos = new[] { "pendiente", "confirmada", "cancelada" };
    return !string.IsNullOrWhiteSpace(estado) &&
        estadosValidos.Contains(estado.Trim(), StringComparer.OrdinalIgnoreCase);
}

static string? ValidateReunionRequest(ReunionRequest request)
{
    if (string.IsNullOrWhiteSpace(request.Nombre))
    {
        return "El nombre es requerido.";
    }

    if (string.IsNullOrWhiteSpace(request.TipoProyecto))
    {
        return "El tipo de proyecto es requerido.";
    }

    return null;
}

static string? ValidateBloqueoRequest(BloqueoRequest request)
{
    if (string.IsNullOrWhiteSpace(request.Motivo))
    {
        return "El motivo es requerido.";
    }

    return null;
}

static Task<bool> HorarioBaseActivoExisteAsync(RufDbContext db, TimeOnly hora)
{
    return db.HorariosBase.AnyAsync(item => item.Hora == hora && item.Activo);
}

static async Task<bool> HorarioOcupadoAsync(RufDbContext db, DateOnly fecha, TimeOnly hora)
{
    var horarioConReunion = await db.Reuniones.AnyAsync(reunion =>
        reunion.Fecha == fecha &&
        reunion.Hora == hora &&
        (reunion.Estado == "pendiente" || reunion.Estado == "confirmada"));

    if (horarioConReunion)
    {
        return true;
    }

    return await db.BloqueosHorarios.AnyAsync(bloqueo =>
        bloqueo.Fecha == fecha &&
        bloqueo.Hora == hora);
}

static ProyectoResponse MapProyectoResponse(Proyecto proyecto)
{
    var imagenes = proyecto.ImagenesPersistidas
        .OrderBy(imagen => imagen.Orden)
        .Select(imagen => imagen.Url)
        .ToList();

    return new ProyectoResponse(
        proyecto.Id,
        proyecto.Titulo,
        proyecto.Slug,
        proyecto.Categoria,
        proyecto.DescripcionCorta,
        proyecto.DescripcionLarga,
        proyecto.Ubicacion,
        proyecto.Anio,
        proyecto.Superficie,
        proyecto.Estado,
        proyecto.Destacado,
        proyecto.ImagenPrincipal,
        proyecto.Alt,
        imagenes,
        proyecto.CreatedAt,
        proyecto.UpdatedAt);
}

static string BuildProyectoAlt(string? alt, string titulo)
{
    return string.IsNullOrWhiteSpace(alt)
        ? $"{titulo} desarrollado por rüf arquitectura"
        : alt.Trim();
}

static List<ProyectoImagen> BuildProyectoImagenes(List<string> imagenes, string alt)
{
    return imagenes
        .Where(imagen => !string.IsNullOrWhiteSpace(imagen))
        .Select((imagen, index) => new ProyectoImagen
        {
            Url = imagen.Trim(),
            Alt = alt,
            Orden = index
        })
        .ToList();
}

static async Task<string> EnsureUniqueProyectoSlugAsync(
    RufDbContext db,
    string baseSlug,
    string? currentId = null)
{
    var slug = string.IsNullOrWhiteSpace(baseSlug)
        ? Guid.NewGuid().ToString("N")[..8]
        : baseSlug;
    var candidate = slug;
    var suffix = 2;

    while (await db.Proyectos.AnyAsync(proyecto =>
        proyecto.Slug == candidate && proyecto.Id != currentId))
    {
        candidate = $"{slug}-{suffix}";
        suffix++;
    }

    return candidate;
}

static async Task SeedProyectoDataAsync(IServiceProvider services, ILogger logger)
{
    try
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<RufDbContext>();

        if (await db.Proyectos.AnyAsync())
        {
            return;
        }

        var seeds = new[]
        {
            new ProyectoRequest(
                "casa moderna",
                "casa",
                "vivienda moderna con espacios amplios.",
                "proyecto residencial pensado para potenciar la luz natural, la amplitud visual y una atmosfera serena en cada ambiente.",
                "buenos aires, argentina",
                "2026",
                "180 m²",
                "publicado",
                true,
                "/images/proyectos/casa interior moderno elegante.jpeg",
                [
                    "/images/proyectos/casa interior moderno elegante.jpeg",
                    "/images/proyectos/departamento.jpg",
                    "/images/proyectos/vestidor 1.jpg"
                ],
                "casa-moderna",
                "proyecto de arquitectura contemporánea en argentina"),
            new ProyectoRequest(
                "departamento centro",
                "interior",
                "interiorismo de departamento con diseño contemporáneo.",
                "renovación interior con foco en circulación, guardado y una estética contemporánea de líneas limpias.",
                "buenos aires, argentina",
                "2025",
                "95 m²",
                "publicado",
                false,
                "/images/proyectos/departamento.jpg",
                [
                    "/images/proyectos/departamento.jpg",
                    "/images/proyectos/casa interior moderno elegante.jpeg"
                ],
                "departamento-centro",
                "interior moderno diseñado por rüf arquitectura"),
            new ProyectoRequest(
                "vestidor bespoke",
                "mueble",
                "diseño de mobiliario a medida con terminaciones premium.",
                "desarrollo de vestidor personalizado con módulos flexibles, iluminación puntual y guardado eficiente.",
                "buenos aires, argentina",
                "2024",
                "24 m²",
                "borrador",
                true,
                "/images/proyectos/vestidor 1.jpg",
                [
                    "/images/proyectos/vestidor 1.jpg",
                    "/images/proyectos/vestidor 2.jpg",
                    "/images/proyectos/vestidor 3.jpg"
                ],
                "vestidor-bespoke",
                "mueble a medida realizado por rüf arquitectura")
        };

        var now = DateTime.UtcNow;
        foreach (var seed in seeds)
        {
            var slug = await EnsureUniqueProyectoSlugAsync(
                db,
                InMemoryDatabase.Slugify(seed.Slug ?? seed.Titulo));
            var alt = BuildProyectoAlt(seed.Alt, seed.Titulo);

            db.Proyectos.Add(new Proyecto
            {
                Id = slug,
                Slug = slug,
                Titulo = seed.Titulo,
                Categoria = seed.Categoria,
                DescripcionCorta = seed.DescripcionCorta,
                DescripcionLarga = seed.DescripcionLarga,
                Ubicacion = seed.Ubicacion,
                Anio = seed.Anio,
                Superficie = seed.Superficie,
                Estado = seed.Estado,
                Destacado = seed.Destacado,
                ImagenPrincipal = seed.ImagenPrincipal,
                Alt = alt,
                CreatedAt = now,
                UpdatedAt = now,
                ImagenesPersistidas = BuildProyectoImagenes(seed.Imagenes, alt)
            });
        }

        await db.SaveChangesAsync();
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "no se pudo ejecutar el seed inicial de proyectos");
    }
}

static TestimonioResponse MapTestimonioResponse(Testimonio testimonio)
{
    return new TestimonioResponse(
        testimonio.Id,
        testimonio.Nombre,
        testimonio.TipoProyecto,
        testimonio.Texto,
        testimonio.Estrellas,
        testimonio.Foto,
        testimonio.Estado,
        testimonio.MostrarEnHome,
        testimonio.CreatedAt,
        testimonio.UpdatedAt);
}

static string? ValidateTestimonioRequest(TestimonioRequest request)
{
    if (request.Estrellas is < 1 or > 5)
    {
        return "Las estrellas deben estar entre 1 y 5.";
    }

    var estadosValidos = new[] { "activo", "inactivo" };
    if (!estadosValidos.Contains(request.Estado, StringComparer.OrdinalIgnoreCase))
    {
        return "El estado debe ser activo o inactivo.";
    }

    return null;
}

static async Task<string> EnsureUniqueTestimonioIdAsync(
    RufDbContext db,
    string baseId)
{
    var id = string.IsNullOrWhiteSpace(baseId)
        ? Guid.NewGuid().ToString("N")[..8]
        : baseId;
    var candidate = id;
    var suffix = 2;

    while (await db.Testimonios.AnyAsync(testimonio => testimonio.Id == candidate))
    {
        candidate = $"{id}-{suffix}";
        suffix++;
    }

    return candidate;
}

static async Task SeedTestimonioDataAsync(IServiceProvider services, ILogger logger)
{
    try
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<RufDbContext>();

        if (await db.Testimonios.AnyAsync())
        {
            return;
        }

        var now = DateTime.UtcNow;
        var seeds = new[]
        {
            new Testimonio(
                "maria-g",
                "maría g.",
                "vivienda",
                "nos acompañaron en todo el proceso, desde la idea hasta la ejecución. super profesionales.",
                5,
                "/images/testimonios/cliente1.jpg",
                "activo",
                true),
            new Testimonio(
                "juan-p",
                "juan p.",
                "interiorismo",
                "lograron exactamente lo que queríamos. el diseño y los detalles fueron impecables.",
                5,
                "/images/testimonios/cliente2.jpg",
                "activo",
                true),
            new Testimonio(
                "lucas-r",
                "lucas r.",
                "muebles a medida",
                "cumplieron tiempos y presupuesto. volveríamos a elegirlas sin dudar.",
                5,
                "/images/testimonios/cliente3.jpg",
                "activo",
                true)
        };

        foreach (var seed in seeds)
        {
            seed.CreatedAt = now;
            seed.UpdatedAt = now;
            db.Testimonios.Add(seed);
        }

        await db.SaveChangesAsync();
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "no se pudo ejecutar el seed inicial de testimonios");
    }
}

static CategoriaResponse MapCategoriaResponse(Categoria categoria)
{
    return new CategoriaResponse(
        categoria.Id,
        categoria.Nombre,
        categoria.CreatedAt,
        categoria.UpdatedAt);
}

static string? ValidateCategoriaRequest(CategoriaRequest request)
{
    if (string.IsNullOrWhiteSpace(request.Nombre))
    {
        return "El nombre es requerido.";
    }

    return null;
}

static async Task<string> EnsureUniqueCategoriaIdAsync(
    RufDbContext db,
    string baseId)
{
    var id = string.IsNullOrWhiteSpace(baseId)
        ? Guid.NewGuid().ToString("N")[..8]
        : baseId;
    var candidate = id;
    var suffix = 2;

    while (await db.Categorias.AnyAsync(categoria => categoria.Id == candidate))
    {
        candidate = $"{id}-{suffix}";
        suffix++;
    }

    return candidate;
}

static async Task SeedCategoriaDataAsync(IServiceProvider services, ILogger logger)
{
    try
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<RufDbContext>();

        if (await db.Categorias.AnyAsync())
        {
            return;
        }

        var now = DateTime.UtcNow;
        var seeds = new[]
        {
            new Categoria("casa", "casa"),
            new Categoria("interior", "interior"),
            new Categoria("mueble", "mueble")
        };

        foreach (var seed in seeds)
        {
            seed.CreatedAt = now;
            seed.UpdatedAt = now;
            db.Categorias.Add(seed);
        }

        await db.SaveChangesAsync();
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "no se pudo ejecutar el seed inicial de categorías");
    }
}

static async Task SeedAgendaDataAsync(IServiceProvider services, ILogger logger)
{
    try
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<RufDbContext>();

        if (await db.HorariosBase.AnyAsync())
        {
            return;
        }

        var now = DateTime.UtcNow;
        var horarios = new[]
        {
            new TimeOnly(10, 0),
            new TimeOnly(11, 0),
            new TimeOnly(12, 0),
            new TimeOnly(16, 0),
            new TimeOnly(17, 0),
            new TimeOnly(18, 0)
        };

        foreach (var (hora, index) in horarios.Select((hora, index) => (hora, index)))
        {
            db.HorariosBase.Add(new HorarioBase
            {
                Id = Guid.NewGuid().ToString("N"),
                Hora = hora,
                Activo = true,
                Orden = index + 1,
                CreatedAt = now,
                UpdatedAt = now
            });
        }

        await db.SaveChangesAsync();
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "no se pudo ejecutar el seed inicial de agenda");
    }
}

public sealed record ProyectoResponse(
    string Id,
    string Titulo,
    string Slug,
    string Categoria,
    string DescripcionCorta,
    string DescripcionLarga,
    string Ubicacion,
    string Anio,
    string Superficie,
    string Estado,
    bool Destacado,
    string ImagenPrincipal,
    string Alt,
    List<string> Imagenes,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public sealed record TestimonioResponse(
    string Id,
    string Nombre,
    string TipoProyecto,
    string Texto,
    int Estrellas,
    string Foto,
    string Estado,
    bool MostrarEnHome,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public sealed record CategoriaResponse(
    string Id,
    string Nombre,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public sealed record ReunionResponse(
    string Id,
    string Nombre,
    string TipoProyecto,
    DateOnly Fecha,
    string Hora,
    string Estado,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public sealed record BloqueoResponse(
    string Id,
    DateOnly Fecha,
    string Hora,
    string Motivo,
    DateTime CreatedAt,
    DateTime UpdatedAt);
