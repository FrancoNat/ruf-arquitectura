using Microsoft.EntityFrameworkCore;
using RufApi.Models;

namespace RufApi.Data;

public sealed class RufDbContext : DbContext
{
    public RufDbContext(DbContextOptions<RufDbContext> options)
        : base(options)
    {
    }

    public DbSet<Proyecto> Proyectos => Set<Proyecto>();
    public DbSet<ProyectoImagen> ProyectoImagenes => Set<ProyectoImagen>();
    public DbSet<ProyectoIncluyeItem> ProyectoIncluyeItems => Set<ProyectoIncluyeItem>();
    public DbSet<Testimonio> Testimonios => Set<Testimonio>();
    public DbSet<Categoria> Categorias => Set<Categoria>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<HorarioBase> HorariosBase => Set<HorarioBase>();
    public DbSet<Reunion> Reuniones => Set<Reunion>();
    public DbSet<BloqueoHorario> BloqueosHorarios => Set<BloqueoHorario>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Proyecto>(entity =>
        {
            entity.ToTable("proyectos");

            entity.HasKey(proyecto => proyecto.Id);

            entity.HasIndex(proyecto => proyecto.Slug)
                .IsUnique();

            entity.Property(proyecto => proyecto.Id)
                .HasMaxLength(120);

            entity.Property(proyecto => proyecto.Titulo)
                .IsRequired()
                .HasMaxLength(180);

            entity.Property(proyecto => proyecto.Slug)
                .IsRequired()
                .HasMaxLength(180);

            entity.Property(proyecto => proyecto.Categoria)
                .IsRequired()
                .HasMaxLength(80);

            entity.Property(proyecto => proyecto.DescripcionCorta)
                .IsRequired()
                .HasMaxLength(500);

            entity.Property(proyecto => proyecto.DescripcionLarga)
                .IsRequired();

            entity.Property(proyecto => proyecto.Ubicacion)
                .IsRequired()
                .HasMaxLength(180);

            entity.Property(proyecto => proyecto.Anio)
                .IsRequired()
                .HasMaxLength(20);

            entity.Property(proyecto => proyecto.Superficie)
                .IsRequired()
                .HasMaxLength(80);

            entity.Property(proyecto => proyecto.Estado)
                .IsRequired()
                .HasMaxLength(40);

            entity.Property(proyecto => proyecto.ImagenPrincipal)
                .IsRequired()
                .HasMaxLength(500);

            entity.Property(proyecto => proyecto.Alt)
                .IsRequired()
                .HasMaxLength(250);

            entity.Property(proyecto => proyecto.CreatedAt)
                .IsRequired();

            entity.Property(proyecto => proyecto.UpdatedAt)
                .IsRequired();

            entity.Ignore(proyecto => proyecto.Imagenes);

            entity.HasMany(proyecto => proyecto.ImagenesPersistidas)
                .WithOne(imagen => imagen.Proyecto)
                .HasForeignKey(imagen => imagen.ProyectoId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(proyecto => proyecto.IncluyeItems)
                .WithOne(item => item.Proyecto)
                .HasForeignKey(item => item.ProyectoId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ProyectoImagen>(entity =>
        {
            entity.ToTable("proyecto_imagenes");

            entity.HasKey(imagen => imagen.Id);

            entity.Property(imagen => imagen.Id)
                .HasMaxLength(120);

            entity.Property(imagen => imagen.Url)
                .IsRequired()
                .HasMaxLength(500);

            entity.Property(imagen => imagen.Alt)
                .IsRequired()
                .HasMaxLength(250);

            entity.Property(imagen => imagen.ProyectoId)
                .IsRequired()
                .HasMaxLength(120);
        });

        modelBuilder.Entity<ProyectoIncluyeItem>(entity =>
        {
            entity.ToTable("proyecto_incluye_items");

            entity.HasKey(item => item.Id);

            entity.Property(item => item.Id)
                .HasMaxLength(120);

            entity.Property(item => item.Titulo)
                .IsRequired()
                .HasMaxLength(180);

            entity.Property(item => item.Descripcion)
                .IsRequired();

            entity.Property(item => item.ItemsJson)
                .IsRequired();

            entity.Property(item => item.ProyectoId)
                .IsRequired()
                .HasMaxLength(120);
        });

        modelBuilder.Entity<Testimonio>(entity =>
        {
            entity.ToTable("testimonios", table =>
            {
                table.HasCheckConstraint(
                    "CK_testimonios_estrellas",
                    "\"Estrellas\" >= 1 AND \"Estrellas\" <= 5");
                table.HasCheckConstraint(
                    "CK_testimonios_estado",
                    "\"Estado\" IN ('activo', 'inactivo')");
            });

            entity.HasKey(testimonio => testimonio.Id);

            entity.Property(testimonio => testimonio.Id)
                .HasMaxLength(120);

            entity.Property(testimonio => testimonio.Nombre)
                .IsRequired()
                .HasMaxLength(160);

            entity.Property(testimonio => testimonio.TipoProyecto)
                .IsRequired()
                .HasMaxLength(120);

            entity.Property(testimonio => testimonio.Texto)
                .IsRequired()
                .HasMaxLength(1000);

            entity.Property(testimonio => testimonio.Foto)
                .IsRequired()
                .HasMaxLength(500);

            entity.Property(testimonio => testimonio.Estado)
                .IsRequired()
                .HasMaxLength(40);

            entity.Property(testimonio => testimonio.CreatedAt)
                .IsRequired();

            entity.Property(testimonio => testimonio.UpdatedAt)
                .IsRequired();

        });

        modelBuilder.Entity<Categoria>(entity =>
        {
            entity.ToTable("categorias");

            entity.HasKey(categoria => categoria.Id);

            entity.HasIndex(categoria => categoria.Nombre)
                .IsUnique();

            entity.Property(categoria => categoria.Id)
                .HasMaxLength(120);

            entity.Property(categoria => categoria.Nombre)
                .IsRequired()
                .HasMaxLength(120);

            entity.Property(categoria => categoria.CreatedAt)
                .IsRequired();

            entity.Property(categoria => categoria.UpdatedAt)
                .IsRequired();
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.ToTable("usuarios", table =>
            {
                table.HasCheckConstraint(
                    "CK_usuarios_rol",
                    "\"Rol\" IN ('admin', 'colaborador')");
            });

            entity.HasKey(usuario => usuario.Id);

            entity.HasIndex(usuario => usuario.Email)
                .IsUnique();

            entity.Property(usuario => usuario.Id)
                .HasMaxLength(120);

            entity.Property(usuario => usuario.Nombre)
                .IsRequired()
                .HasMaxLength(180);

            entity.Property(usuario => usuario.Email)
                .IsRequired()
                .HasMaxLength(180);

            entity.Property(usuario => usuario.PasswordHash)
                .IsRequired();

            entity.Property(usuario => usuario.Rol)
                .IsRequired()
                .HasMaxLength(40);

            entity.Property(usuario => usuario.Activo)
                .IsRequired();

            entity.Property(usuario => usuario.CreatedAt)
                .IsRequired();

            entity.Property(usuario => usuario.UpdatedAt)
                .IsRequired();
        });

        modelBuilder.Entity<HorarioBase>(entity =>
        {
            entity.ToTable("horarios_base");

            entity.HasKey(horario => horario.Id);

            entity.HasIndex(horario => horario.Hora)
                .IsUnique();

            entity.Property(horario => horario.Id)
                .HasMaxLength(120);

            entity.Property(horario => horario.Hora)
                .IsRequired();

            entity.Property(horario => horario.Activo)
                .IsRequired();

            entity.Property(horario => horario.Orden)
                .IsRequired();

            entity.Property(horario => horario.CreatedAt)
                .IsRequired();

            entity.Property(horario => horario.UpdatedAt)
                .IsRequired();
        });

        modelBuilder.Entity<Reunion>(entity =>
        {
            entity.ToTable("reuniones", table =>
            {
                table.HasCheckConstraint(
                    "CK_reuniones_estado",
                    "\"Estado\" IN ('pendiente', 'confirmada', 'cancelada')");
            });

            entity.HasKey(reunion => reunion.Id);

            entity.HasIndex(reunion => new { reunion.Fecha, reunion.Hora });

            entity.Property(reunion => reunion.Id)
                .HasMaxLength(120);

            entity.Property(reunion => reunion.Nombre)
                .IsRequired()
                .HasMaxLength(160);

            entity.Property(reunion => reunion.TipoProyecto)
                .IsRequired()
                .HasMaxLength(120);

            entity.Property(reunion => reunion.Fecha)
                .IsRequired();

            entity.Property(reunion => reunion.Hora)
                .IsRequired();

            entity.Property(reunion => reunion.Estado)
                .IsRequired()
                .HasMaxLength(40);

            entity.Property(reunion => reunion.CreatedAt)
                .IsRequired();

            entity.Property(reunion => reunion.UpdatedAt)
                .IsRequired();
        });

        modelBuilder.Entity<BloqueoHorario>(entity =>
        {
            entity.ToTable("bloqueos_horarios");

            entity.HasKey(bloqueo => bloqueo.Id);

            entity.HasIndex(bloqueo => new { bloqueo.Fecha, bloqueo.Hora })
                .IsUnique();

            entity.Property(bloqueo => bloqueo.Id)
                .HasMaxLength(120);

            entity.Property(bloqueo => bloqueo.Fecha)
                .IsRequired();

            entity.Property(bloqueo => bloqueo.Hora)
                .IsRequired();

            entity.Property(bloqueo => bloqueo.Motivo)
                .IsRequired()
                .HasMaxLength(300);

            entity.Property(bloqueo => bloqueo.CreatedAt)
                .IsRequired();

            entity.Property(bloqueo => bloqueo.UpdatedAt)
                .IsRequired();
        });
    }
}
