using RufApi.Data;
using RufApi.DTOs;
using RufApi.Models;

var builder = WebApplication.CreateBuilder(args);

const string FrontendCorsPolicy = "FrontendCorsPolicy";

builder.Services.AddSingleton<InMemoryDatabase>();
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
}

app.UseCors(FrontendCorsPolicy);

app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }))
    .WithName("HealthCheck")
    .WithOpenApi();

var proyectos = app.MapGroup("/api/proyectos").WithTags("Proyectos");

proyectos.MapGet("/", (
    InMemoryDatabase db,
    string? categoria,
    string? estado,
    bool? destacado) =>
{
    var query = db.Proyectos.AsEnumerable();

    if (!string.IsNullOrWhiteSpace(categoria))
    {
        query = query.Where(proyecto => proyecto.Categoria.Equals(categoria, StringComparison.OrdinalIgnoreCase));
    }

    if (!string.IsNullOrWhiteSpace(estado))
    {
        query = query.Where(proyecto => proyecto.Estado.Equals(estado, StringComparison.OrdinalIgnoreCase));
    }

    if (destacado is not null)
    {
        query = query.Where(proyecto => proyecto.Destacado == destacado);
    }

    return Results.Ok(query.OrderBy(proyecto => proyecto.Titulo));
});

proyectos.MapGet("/{id}", (InMemoryDatabase db, string id) =>
{
    var proyecto = db.Proyectos.FirstOrDefault(item => item.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
    return proyecto is null ? Results.NotFound() : Results.Ok(proyecto);
});

proyectos.MapPost("/", (InMemoryDatabase db, ProyectoRequest request) =>
{
    var id = InMemoryDatabase.EnsureUniqueId(
        InMemoryDatabase.Slugify(request.Titulo),
        db.Proyectos.Select(proyecto => proyecto.Id));

    var proyecto = new Proyecto(
        id,
        request.Titulo,
        request.Categoria,
        request.DescripcionCorta,
        request.DescripcionLarga,
        request.Ubicacion,
        request.Anio,
        request.Superficie,
        request.Estado,
        request.Destacado,
        request.ImagenPrincipal,
        request.Imagenes);

    db.Proyectos.Add(proyecto);

    return Results.Created($"/api/proyectos/{proyecto.Id}", proyecto);
});

proyectos.MapPut("/{id}", (InMemoryDatabase db, string id, ProyectoRequest request) =>
{
    var index = db.Proyectos.FindIndex(item => item.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
    if (index < 0)
    {
        return Results.NotFound();
    }

    var proyecto = new Proyecto(
        id,
        request.Titulo,
        request.Categoria,
        request.DescripcionCorta,
        request.DescripcionLarga,
        request.Ubicacion,
        request.Anio,
        request.Superficie,
        request.Estado,
        request.Destacado,
        request.ImagenPrincipal,
        request.Imagenes);

    db.Proyectos[index] = proyecto;

    return Results.Ok(proyecto);
});

proyectos.MapDelete("/{id}", (InMemoryDatabase db, string id) =>
{
    var removed = db.Proyectos.RemoveAll(item => item.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
    return removed == 0 ? Results.NotFound() : Results.NoContent();
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

testimonios.MapGet("/", (InMemoryDatabase db, string? estado, bool? mostrarEnHome) =>
{
    var query = db.Testimonios.AsEnumerable();

    if (!string.IsNullOrWhiteSpace(estado))
    {
        query = query.Where(testimonio => testimonio.Estado.Equals(estado, StringComparison.OrdinalIgnoreCase));
    }

    if (mostrarEnHome is not null)
    {
        query = query.Where(testimonio => testimonio.MostrarEnHome == mostrarEnHome);
    }

    return Results.Ok(query.OrderBy(testimonio => testimonio.Nombre));
});

testimonios.MapGet("/{id}", (InMemoryDatabase db, string id) =>
{
    var testimonio = db.Testimonios.FirstOrDefault(item => item.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
    return testimonio is null ? Results.NotFound() : Results.Ok(testimonio);
});

testimonios.MapPost("/", (InMemoryDatabase db, TestimonioRequest request) =>
{
    if (request.Estrellas is < 1 or > 5)
    {
        return Results.BadRequest(new { error = "Las estrellas deben estar entre 1 y 5." });
    }

    var id = InMemoryDatabase.EnsureUniqueId(
        InMemoryDatabase.Slugify(request.Nombre),
        db.Testimonios.Select(testimonio => testimonio.Id));

    var testimonio = new Testimonio(
        id,
        request.Nombre,
        request.TipoProyecto,
        request.Texto,
        request.Estrellas,
        request.Foto,
        request.Estado,
        request.MostrarEnHome);

    db.Testimonios.Add(testimonio);

    return Results.Created($"/api/testimonios/{testimonio.Id}", testimonio);
});

testimonios.MapPut("/{id}", (InMemoryDatabase db, string id, TestimonioRequest request) =>
{
    if (request.Estrellas is < 1 or > 5)
    {
        return Results.BadRequest(new { error = "Las estrellas deben estar entre 1 y 5." });
    }

    var index = db.Testimonios.FindIndex(item => item.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
    if (index < 0)
    {
        return Results.NotFound();
    }

    var testimonio = new Testimonio(
        id,
        request.Nombre,
        request.TipoProyecto,
        request.Texto,
        request.Estrellas,
        request.Foto,
        request.Estado,
        request.MostrarEnHome);

    db.Testimonios[index] = testimonio;

    return Results.Ok(testimonio);
});

testimonios.MapDelete("/{id}", (InMemoryDatabase db, string id) =>
{
    var removed = db.Testimonios.RemoveAll(item => item.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
    return removed == 0 ? Results.NotFound() : Results.NoContent();
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
