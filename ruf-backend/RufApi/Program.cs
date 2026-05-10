using System.IdentityModel.Tokens.Jwt;
using System.Globalization;
using System.Security.Claims;
using System.Text.Json;
using System.Text;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RufApi.Data;
using RufApi.DTOs;
using RufApi.Models;

var builder = WebApplication.CreateBuilder(args);

const string FrontendCorsPolicy = "FrontendCorsPolicy";

builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = null;
});

builder.Services.AddSingleton<InMemoryDatabase>();
builder.Services.AddDbContext<RufDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<PasswordHasher<Usuario>>();
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = long.MaxValue;
    options.ValueLengthLimit = int.MaxValue;
    options.MultipartHeadersLengthLimit = int.MaxValue;
});
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var key = builder.Configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("Jwt:Key no está configurado.");

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
        };
    });
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("admin"));
});
builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "https://ruf-arquitectura.vercel.app"
            )
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
    await SeedUsuarioDataAsync(app.Services, app.Configuration, app.Logger);
    await SeedAgendaDataAsync(app.Services, app.Logger);
}
if (app.Environment.IsProduction())
{
    await SeedUsuarioDataAsync(app.Services, app.Configuration, app.Logger);
}

app.UseCors(FrontendCorsPolicy);
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }))
    .WithName("HealthCheck")
    .WithOpenApi();

var auth = app.MapGroup("/api/auth").WithTags("Auth");

auth.MapPost("/login", async (
    RufDbContext db,
    PasswordHasher<Usuario> passwordHasher,
    IConfiguration configuration,
    LoginRequest request) =>
{
    var email = NormalizeEmail(request.Email);
    var usuario = await db.Usuarios.FirstOrDefaultAsync(item => item.Email == email);

    if (usuario is null)
    {
        return Results.Unauthorized();
    }

    var passwordResult = passwordHasher.VerifyHashedPassword(
        usuario,
        usuario.PasswordHash,
        request.Password);

    if (passwordResult == PasswordVerificationResult.Failed)
    {
        return Results.Unauthorized();
    }

    if (!usuario.Activo)
    {
        return Results.Forbid();
    }

    return Results.Ok(new LoginResponse(
        GenerateJwtToken(usuario, configuration),
        MapUsuarioResponse(usuario)));
});

var adminUsuarios = app.MapGroup("/api/admin/usuarios")
    .WithTags("Admin Usuarios")
    .RequireAuthorization();

adminUsuarios.MapGet("/", async (RufDbContext db) =>
{
    var usuarios = await db.Usuarios
        .AsNoTracking()
        .OrderBy(usuario => usuario.Nombre)
        .ToListAsync();

    return Results.Ok(usuarios.Select(MapUsuarioResponse));
});

adminUsuarios.MapPost("/", async (
    RufDbContext db,
    PasswordHasher<Usuario> passwordHasher,
    UsuarioRequest request) =>
{
    var validationError = ValidateUsuarioRequest(request, passwordRequired: true);
    if (validationError is not null)
    {
        return Results.BadRequest(new { error = validationError });
    }

    var email = NormalizeEmail(request.Email);
    if (await db.Usuarios.AnyAsync(usuario => usuario.Email == email))
    {
        return Results.Conflict(new { error = "ese email ya existe" });
    }

    var now = DateTime.UtcNow;
    var usuario = new Usuario
    {
        Id = Guid.NewGuid().ToString("N"),
        Nombre = request.Nombre.Trim().ToLowerInvariant(),
        Email = email,
        Rol = request.Rol.Trim().ToLowerInvariant(),
        Activo = request.Activo,
        CreatedAt = now,
        UpdatedAt = now
    };
    usuario.PasswordHash = passwordHasher.HashPassword(usuario, request.Password!);

    db.Usuarios.Add(usuario);
    await db.SaveChangesAsync();

    return Results.Created($"/api/admin/usuarios/{usuario.Id}", MapUsuarioResponse(usuario));
}).RequireAuthorization("AdminOnly");

adminUsuarios.MapPut("/{id}", async (
    RufDbContext db,
    PasswordHasher<Usuario> passwordHasher,
    string id,
    UsuarioRequest request) =>
{
    var validationError = ValidateUsuarioRequest(request, passwordRequired: false);
    if (validationError is not null)
    {
        return Results.BadRequest(new { error = validationError });
    }

    var usuario = await db.Usuarios.FirstOrDefaultAsync(item => item.Id == id);
    if (usuario is null)
    {
        return Results.NotFound();
    }

    var email = NormalizeEmail(request.Email);
    var emailEnUso = await db.Usuarios.AnyAsync(item => item.Id != id && item.Email == email);
    if (emailEnUso)
    {
        return Results.Conflict(new { error = "ese email ya existe" });
    }

    var dejaDeSerAdminActivo = usuario.Rol == "admin" &&
        usuario.Activo &&
        (request.Rol.Trim().ToLowerInvariant() != "admin" || !request.Activo);
    if (dejaDeSerAdminActivo && await EsUltimoAdminActivoAsync(db, usuario.Id))
    {
        return Results.Conflict(new { error = "no se puede desactivar el último admin activo" });
    }

    usuario.Nombre = request.Nombre.Trim().ToLowerInvariant();
    usuario.Email = email;
    usuario.Rol = request.Rol.Trim().ToLowerInvariant();
    usuario.Activo = request.Activo;
    usuario.UpdatedAt = DateTime.UtcNow;

    if (!string.IsNullOrWhiteSpace(request.Password))
    {
        usuario.PasswordHash = passwordHasher.HashPassword(usuario, request.Password);
    }

    await db.SaveChangesAsync();

    return Results.Ok(MapUsuarioResponse(usuario));
}).RequireAuthorization("AdminOnly");

adminUsuarios.MapDelete("/{id}", async (
    RufDbContext db,
    IConfiguration configuration,
    ClaimsPrincipal currentUser,
    string id) =>
{
    if (!PuedeEliminarUsuarios(currentUser, configuration))
    {
        return Results.Forbid();
    }

    var usuario = await db.Usuarios.FirstOrDefaultAsync(item => item.Id == id);
    if (usuario is null)
    {
        return Results.NotFound();
    }

    if (usuario.Rol == "admin" && usuario.Activo && await EsUltimoAdminActivoAsync(db, usuario.Id))
    {
        return Results.Conflict(new { error = "no se puede desactivar el último admin activo" });
    }

    usuario.Activo = false;
    usuario.UpdatedAt = DateTime.UtcNow;
    await db.SaveChangesAsync();

    return Results.NoContent();
}).RequireAuthorization();

var uploads = app.MapGroup("/api/admin/uploads")
    .WithTags("Admin Uploads")
    .RequireAuthorization();

uploads.MapPost("/image", async (HttpRequest request, IConfiguration configuration, ILogger<Program> logger) =>
{
    if (!request.HasFormContentType)
    {
        return Results.BadRequest(new { error = "la solicitud debe ser multipart/form-data" });
    }

    var form = await request.ReadFormAsync();
    var file = form.Files.GetFile("file");

    if (file is null || file.Length == 0)
    {
        return Results.BadRequest(new { error = "no se recibió ningún archivo" });
    }

    await using var stream = file.OpenReadStream();
    if (!await IsSupportedImageFileAsync(file, stream))
    {
        return Results.BadRequest(new
        {
            error = "tipo de imagen inválido. Subí una imagen JPG o PNG.",
            detail = $"tipo recibido: {file.ContentType}; archivo: {file.FileName}"
        });
    }

    var settings = GetCloudinarySettings(configuration);
    if (!settings.IsConfigured)
    {
        logger.LogError("Cloudinary no está configurado");
        return Results.Problem("cloudinary no está configurado", statusCode: StatusCodes.Status500InternalServerError);
    }

    var cloudinary = new Cloudinary(new Account(
        settings.CloudName,
        settings.ApiKey,
        settings.ApiSecret));
    var uploadParams = new ImageUploadParams
    {
        File = new FileDescription(file.FileName, stream),
        Folder = "ruf-arquitectura",
        UseFilename = true,
        UniqueFilename = true,
        Overwrite = false
    };

    try
    {
        var result = await cloudinary.UploadAsync(uploadParams);
        if (result.Error is not null)
        {
            logger.LogError("error cloudinary: {Message}", result.Error.Message);
            return Results.BadRequest(new
            {
                error = "cloudinary rechazó la imagen. Revisá el tamaño máximo permitido por el plan de Cloudinary.",
                detail = result.Error.Message
            });
        }

        return Results.Ok(new UploadImageResponse(result.SecureUrl.ToString(), result.PublicId));
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "falló la subida a cloudinary");
        return Results.BadRequest(new
        {
            error = "no pudimos subir la imagen. Subí una imagen JPG o PNG.",
            detail = ex.Message
        });
    }
})
.DisableAntiforgery();

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
        .Include(proyecto => proyecto.IncluyeItems)
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
        .Include(item => item.IncluyeItems)
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
        ImagenesPersistidas = BuildProyectoImagenes(request.Imagenes, alt),
        IncluyeItems = BuildProyectoIncluyeItems(request.Incluye)
    };

    db.Proyectos.Add(proyecto);
    await db.SaveChangesAsync();

    return Results.Created($"/api/proyectos/{proyecto.Slug}", MapProyectoResponse(proyecto));
}).RequireAuthorization();

proyectos.MapPut("/{id}", async (RufDbContext db, string id, ProyectoRequest request) =>
{
    var normalized = id.Trim().ToLowerInvariant();
    var proyecto = await db.Proyectos
        .Include(item => item.ImagenesPersistidas)
        .Include(item => item.IncluyeItems)
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
    proyecto.IncluyeItems.Clear();
    proyecto.IncluyeItems.AddRange(BuildProyectoIncluyeItems(request.Incluye));

    await db.SaveChangesAsync();

    return Results.Ok(MapProyectoResponse(proyecto));
}).RequireAuthorization();

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
}).RequireAuthorization();

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
}).RequireAuthorization();

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
}).RequireAuthorization();

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
}).RequireAuthorization();

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
}).RequireAuthorization();

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
}).RequireAuthorization();

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
}).RequireAuthorization();

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
}).RequireAuthorization();

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
}).RequireAuthorization();

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
        Motivo = string.IsNullOrWhiteSpace(request.Motivo)
            ? "bloqueo manual"
            : request.Motivo.Trim(),
        CreatedAt = now,
        UpdatedAt = now
    };

    db.BloqueosHorarios.Add(bloqueo);
    await db.SaveChangesAsync();

    return Results.Created($"/api/agenda/bloqueos/{bloqueo.Id}", MapBloqueoResponse(bloqueo));
}).RequireAuthorization();

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
}).RequireAuthorization();

app.Run();

static string GenerateJwtToken(Usuario usuario, IConfiguration configuration)
{
    var key = configuration["Jwt:Key"]
        ?? throw new InvalidOperationException("Jwt:Key no está configurado.");
    var issuer = configuration["Jwt:Issuer"];
    var audience = configuration["Jwt:Audience"];
    var expiresMinutes = configuration.GetValue("Jwt:ExpiresMinutes", 480);
    var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
    var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

    var claims = new[]
    {
        new Claim(JwtRegisteredClaimNames.Sub, usuario.Id),
        new Claim(JwtRegisteredClaimNames.Email, usuario.Email),
        new Claim(ClaimTypes.NameIdentifier, usuario.Id),
        new Claim(ClaimTypes.Name, usuario.Nombre),
        new Claim(ClaimTypes.Email, usuario.Email),
        new Claim(ClaimTypes.Role, usuario.Rol)
    };

    var token = new JwtSecurityToken(
        issuer,
        audience,
        claims,
        expires: DateTime.UtcNow.AddMinutes(expiresMinutes),
        signingCredentials: credentials);

    return new JwtSecurityTokenHandler().WriteToken(token);
}

static UsuarioResponse MapUsuarioResponse(Usuario usuario)
{
    return new UsuarioResponse(
        usuario.Id,
        usuario.Nombre,
        usuario.Email,
        usuario.Rol,
        usuario.Activo,
        usuario.CreatedAt,
        usuario.UpdatedAt);
}

static string? ValidateUsuarioRequest(UsuarioRequest request, bool passwordRequired)
{
    if (string.IsNullOrWhiteSpace(request.Nombre))
    {
        return "El nombre es requerido.";
    }

    if (string.IsNullOrWhiteSpace(request.Email))
    {
        return "El email es requerido.";
    }

    if (passwordRequired && string.IsNullOrWhiteSpace(request.Password))
    {
        return "La contraseña es requerida.";
    }

    if (!string.IsNullOrWhiteSpace(request.Password) && request.Password.Length < 6)
    {
        return "La contraseña debe tener al menos 6 caracteres.";
    }

    if (!RolUsuarioValido(request.Rol))
    {
        return "El rol debe ser admin o colaborador.";
    }

    return null;
}

static bool RolUsuarioValido(string? rol)
{
    var roles = new[] { "admin", "colaborador" };
    return !string.IsNullOrWhiteSpace(rol) &&
        roles.Contains(rol.Trim(), StringComparer.OrdinalIgnoreCase);
}

static string NormalizeEmail(string email)
{
    return email.Trim().ToLowerInvariant();
}

static Task<bool> EsUltimoAdminActivoAsync(RufDbContext db, string usuarioId)
{
    return db.Usuarios.AnyAsync(usuario =>
        usuario.Id != usuarioId &&
        usuario.Rol == "admin" &&
        usuario.Activo);
}

static bool PuedeEliminarUsuarios(ClaimsPrincipal user, IConfiguration configuration)
{
    if (user.IsInRole("admin"))
    {
        return true;
    }

    var nombre = NormalizePermissionText(user.FindFirstValue(ClaimTypes.Name) ?? string.Empty);
    var usuariosHabilitados = configuration
        .GetSection("Permissions:DeleteUsersAllowedNames")
        .Get<string[]>()
        ?.Select(NormalizePermissionText)
        .ToHashSet(StringComparer.OrdinalIgnoreCase)
        ?? [];

    return usuariosHabilitados.Contains(nombre);
}

static string NormalizePermissionText(string value)
{
    var normalized = value.Trim().ToLowerInvariant().Normalize(NormalizationForm.FormD);
    var builder = new StringBuilder();

    foreach (var character in normalized)
    {
        if (CharUnicodeInfo.GetUnicodeCategory(character) == UnicodeCategory.NonSpacingMark)
        {
            continue;
        }

        builder.Append(character);
    }

    return builder.ToString().Normalize(NormalizationForm.FormC);
}

static CloudinarySettings GetCloudinarySettings(IConfiguration configuration)
{
    var cloudName = configuration["CLOUDINARY_CLOUD_NAME"]
        ?? configuration["Cloudinary:CloudName"]
        ?? string.Empty;
    var apiKey = configuration["CLOUDINARY_API_KEY"]
        ?? configuration["Cloudinary:ApiKey"]
        ?? string.Empty;
    var apiSecret = configuration["CLOUDINARY_API_SECRET"]
        ?? configuration["Cloudinary:ApiSecret"]
        ?? string.Empty;

    return new CloudinarySettings(
        cloudName.Trim(),
        apiKey.Trim(),
        apiSecret.Trim());
}

static async Task<bool> IsSupportedImageFileAsync(IFormFile file, Stream stream)
{
    var allowedTypes = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg",
        "image/jpg",
        "image/pjpeg",
        "image/png",
        "application/octet-stream"
    };
    var allowedExtensions = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg",
        ".jpeg",
        ".png"
    };
    var extension = Path.GetExtension(file.FileName);
    var hasAllowedExtension = allowedExtensions.Contains(extension);
    var hasAllowedContentType =
        allowedTypes.Contains(file.ContentType) ||
        string.IsNullOrWhiteSpace(file.ContentType);
    var hasAllowedSignature = await HasSupportedImageSignatureAsync(stream);
    stream.Position = 0;

    if (hasAllowedSignature)
    {
        return true;
    }

    return hasAllowedContentType && hasAllowedExtension;
}

static async Task<bool> HasSupportedImageSignatureAsync(Stream stream)
{
    var buffer = new byte[8];
    var read = await stream.ReadAsync(buffer);

    var isJpeg = read >= 3 &&
        buffer[0] == 0xFF &&
        buffer[1] == 0xD8 &&
        buffer[2] == 0xFF;
    var isPng = read >= 8 &&
        buffer[0] == 0x89 &&
        buffer[1] == 0x50 &&
        buffer[2] == 0x4E &&
        buffer[3] == 0x47 &&
        buffer[4] == 0x0D &&
        buffer[5] == 0x0A &&
        buffer[6] == 0x1A &&
        buffer[7] == 0x0A;

    return isJpeg || isPng;
}

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
    var incluye = proyecto.IncluyeItems
        .OrderBy(item => item.Orden)
        .Select(MapProyectoIncluyeItemResponse)
        .ToList();
    if (incluye.Count == 0)
    {
        incluye = GetDefaultProyectoIncluyeItems()
            .Select(item => new ProyectoIncluyeItemResponse(
                item.Titulo,
                item.Descripcion,
                NormalizeProyectoIncluyeItems(item.Items)))
            .ToList();
    }

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
        incluye,
        proyecto.CreatedAt,
        proyecto.UpdatedAt);
}

static ProyectoIncluyeItemResponse MapProyectoIncluyeItemResponse(ProyectoIncluyeItem item)
{
    return new ProyectoIncluyeItemResponse(
        item.Titulo,
        item.Descripcion,
        ParseProyectoIncluyeItems(item.ItemsJson));
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

static List<ProyectoIncluyeItemRequest> GetDefaultProyectoIncluyeItems()
{
    return
    [
        new(
            "reunión inicial",
            "analizamos tu baño actual, puntos a mejorar y el estilo buscado. Para esta instancia vamos a pedirte previamente fotos del espacio y sus medidas."),
        new(
            "segunda reunión: propuesta de diseño en 3D",
            "te presentamos una primera propuesta de cómo quedará tu baño. La revisamos juntos y ajustamos, modificamos o repensamos lo necesario para que el proyecto se ajuste a lo que buscás y necesitás."),
        new(
            "entrega final",
            "recibís la carpeta completa del proyecto con:",
            [
                "renders finales",
                "planos 2D del espacio",
                "lista de compras de materiales y productos sugeridos",
                "detalles técnicos si hay muebles a medida"
            ])
    ];
}

static List<ProyectoIncluyeItem> BuildProyectoIncluyeItems(
    List<ProyectoIncluyeItemRequest>? items)
{
    var source = items is { Count: > 0 } ? items : GetDefaultProyectoIncluyeItems();

    return source
        .Where(item =>
            !string.IsNullOrWhiteSpace(item.Titulo) ||
            !string.IsNullOrWhiteSpace(item.Descripcion) ||
            item.Items is { Count: > 0 })
        .Select((item, index) => new ProyectoIncluyeItem
        {
            Titulo = item.Titulo.Trim(),
            Descripcion = item.Descripcion.Trim(),
            ItemsJson = JsonSerializer.Serialize(NormalizeProyectoIncluyeItems(item.Items)),
            Orden = index
        })
        .ToList();
}

static List<string> NormalizeProyectoIncluyeItems(List<string>? items)
{
    return items?
        .Select(item => item.Trim())
        .Where(item => !string.IsNullOrWhiteSpace(item))
        .ToList() ?? [];
}

static List<string> ParseProyectoIncluyeItems(string itemsJson)
{
    try
    {
        return JsonSerializer.Deserialize<List<string>>(itemsJson) ?? [];
    }
    catch
    {
        return [];
    }
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
                ImagenesPersistidas = BuildProyectoImagenes(seed.Imagenes, alt),
                IncluyeItems = BuildProyectoIncluyeItems(seed.Incluye)
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

static async Task SeedUsuarioDataAsync(
    IServiceProvider services,
    IConfiguration configuration,
    ILogger logger)
{
    try
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<RufDbContext>();
        var passwordHasher = scope.ServiceProvider.GetRequiredService<PasswordHasher<Usuario>>();

        if (await db.Usuarios.AnyAsync())
        {
            return;
        }

        var password = configuration["AdminSeed:Password"];
        if (string.IsNullOrWhiteSpace(password))
        {
            logger.LogWarning("AdminSeed:Password no está configurado. Se omite el seed inicial de usuarios.");
            return;
        }

        var now = DateTime.UtcNow;
        var usuario = new Usuario
        {
            Id = Guid.NewGuid().ToString("N"),
            Nombre = configuration["AdminSeed:Nombre"] ?? "admin rüf",
            Email = configuration["AdminSeed:Email"]
                ?? throw new InvalidOperationException("AdminSeed:Email no está configurado."),
            Rol = configuration["AdminSeed:Rol"] ?? "admin",
            Activo = true,
            CreatedAt = now,
            UpdatedAt = now
        };
        usuario.PasswordHash = passwordHasher.HashPassword(usuario, password);

        db.Usuarios.Add(usuario);
        await db.SaveChangesAsync();
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "no se pudo ejecutar el seed inicial de usuarios");
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
    List<ProyectoIncluyeItemResponse> Incluye,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public sealed record ProyectoIncluyeItemResponse(
    string Titulo,
    string Descripcion,
    List<string> Items);

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

public sealed record UsuarioResponse(
    string Id,
    string Nombre,
    string Email,
    string Rol,
    bool Activo,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public sealed record LoginResponse(
    string Token,
    UsuarioResponse Usuario);

public sealed record UploadImageResponse(
    string Url,
    string PublicId);

public sealed record CloudinarySettings(
    string CloudName,
    string ApiKey,
    string ApiSecret)
{
    public bool IsConfigured =>
        !string.IsNullOrWhiteSpace(CloudName) &&
        !string.IsNullOrWhiteSpace(ApiKey) &&
        !string.IsNullOrWhiteSpace(ApiSecret);
}

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
