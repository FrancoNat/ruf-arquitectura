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

categorias.MapGet("/", (InMemoryDatabase db) => Results.Ok(db.Categorias.OrderBy(categoria => categoria.Nombre)));

categorias.MapPost("/", (InMemoryDatabase db, CategoriaRequest request) =>
{
    var id = InMemoryDatabase.EnsureUniqueId(
        InMemoryDatabase.Slugify(request.Nombre),
        db.Categorias.Select(categoria => categoria.Id));

    var categoria = new Categoria(id, request.Nombre.Trim().ToLowerInvariant());
    db.Categorias.Add(categoria);

    return Results.Created($"/api/categorias/{categoria.Id}", categoria);
});

categorias.MapPut("/{id}", (InMemoryDatabase db, string id, CategoriaRequest request) =>
{
    var index = db.Categorias.FindIndex(item => item.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
    if (index < 0)
    {
        return Results.NotFound();
    }

    var categoria = new Categoria(id, request.Nombre.Trim().ToLowerInvariant());
    db.Categorias[index] = categoria;

    return Results.Ok(categoria);
});

categorias.MapDelete("/{id}", (InMemoryDatabase db, string id) =>
{
    var removed = db.Categorias.RemoveAll(item => item.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
    return removed == 0 ? Results.NotFound() : Results.NoContent();
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

agenda.MapGet("/horarios-base", (InMemoryDatabase db) => Results.Ok(db.HorariosBase));

agenda.MapGet("/horarios-disponibles", (InMemoryDatabase db, DateOnly fecha) =>
{
    var reunionesOcupadas = db.Reuniones
        .Where(reunion =>
            reunion.Fecha == fecha &&
            (reunion.Estado.Equals("pendiente", StringComparison.OrdinalIgnoreCase) ||
             reunion.Estado.Equals("confirmada", StringComparison.OrdinalIgnoreCase)))
        .Select(reunion => reunion.Hora)
        .ToHashSet();

    var bloqueos = db.Bloqueos
        .Where(bloqueo => bloqueo.Fecha == fecha)
        .Select(bloqueo => bloqueo.Hora)
        .ToHashSet();

    var disponibles = db.HorariosBase
        .Where(hora => !reunionesOcupadas.Contains(hora) && !bloqueos.Contains(hora))
        .ToList();

    return Results.Ok(disponibles);
});

agenda.MapGet("/reuniones", (InMemoryDatabase db, DateOnly? fecha) =>
{
    var query = db.Reuniones.AsEnumerable();

    if (fecha is not null)
    {
        query = query.Where(reunion => reunion.Fecha == fecha);
    }

    return Results.Ok(query.OrderBy(reunion => reunion.Fecha).ThenBy(reunion => reunion.Hora));
});

agenda.MapPost("/reuniones", (InMemoryDatabase db, ReunionRequest request) =>
{
    if (!db.HorariosBase.Contains(request.Hora))
    {
        return Results.BadRequest(new { error = "El horario elegido no existe en la agenda base." });
    }

    var horarioOcupado = db.Reuniones.Any(reunion =>
        reunion.Fecha == request.Fecha &&
        reunion.Hora == request.Hora &&
        (reunion.Estado.Equals("pendiente", StringComparison.OrdinalIgnoreCase) ||
         reunion.Estado.Equals("confirmada", StringComparison.OrdinalIgnoreCase)));

    var horarioBloqueado = db.Bloqueos.Any(bloqueo => bloqueo.Fecha == request.Fecha && bloqueo.Hora == request.Hora);

    if (horarioOcupado || horarioBloqueado)
    {
        return Results.Conflict(new { error = "El horario elegido ya no está disponible." });
    }

    var reunion = new Reunion(
        Guid.NewGuid().ToString("N")[..8],
        request.Nombre,
        request.TipoProyecto,
        request.Fecha,
        request.Hora,
        "pendiente");

    db.Reuniones.Add(reunion);

    return Results.Created($"/api/agenda/reuniones/{reunion.Id}", reunion);
});

agenda.MapPatch("/reuniones/{id}/estado", (InMemoryDatabase db, string id, EstadoReunionRequest request) =>
{
    var estadosValidos = new[] { "pendiente", "confirmada", "cancelada" };
    if (!estadosValidos.Contains(request.Estado, StringComparer.OrdinalIgnoreCase))
    {
        return Results.BadRequest(new { error = "El estado debe ser pendiente, confirmada o cancelada." });
    }

    var index = db.Reuniones.FindIndex(item => item.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
    if (index < 0)
    {
        return Results.NotFound();
    }

    var reunion = db.Reuniones[index] with { Estado = request.Estado.ToLowerInvariant() };
    db.Reuniones[index] = reunion;

    return Results.Ok(reunion);
});

agenda.MapDelete("/reuniones/{id}", (InMemoryDatabase db, string id) =>
{
    var removed = db.Reuniones.RemoveAll(item => item.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
    return removed == 0 ? Results.NotFound() : Results.NoContent();
});

agenda.MapGet("/bloqueos", (InMemoryDatabase db, DateOnly? fecha) =>
{
    var query = db.Bloqueos.AsEnumerable();

    if (fecha is not null)
    {
        query = query.Where(bloqueo => bloqueo.Fecha == fecha);
    }

    return Results.Ok(query.OrderBy(bloqueo => bloqueo.Fecha).ThenBy(bloqueo => bloqueo.Hora));
});

agenda.MapPost("/bloqueos", (InMemoryDatabase db, BloqueoRequest request) =>
{
    if (!db.HorariosBase.Contains(request.Hora))
    {
        return Results.BadRequest(new { error = "El horario elegido no existe en la agenda base." });
    }

    var bloqueo = new Bloqueo(
        $"b{Guid.NewGuid().ToString("N")[..8]}",
        request.Fecha,
        request.Hora,
        request.Motivo);

    db.Bloqueos.Add(bloqueo);

    return Results.Created($"/api/agenda/bloqueos/{bloqueo.Id}", bloqueo);
});

agenda.MapDelete("/bloqueos/{id}", (InMemoryDatabase db, string id) =>
{
    var removed = db.Bloqueos.RemoveAll(item => item.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
    return removed == 0 ? Results.NotFound() : Results.NoContent();
});

app.Run();

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
