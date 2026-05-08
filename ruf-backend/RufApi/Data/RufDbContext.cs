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
    public DbSet<Testimonio> Testimonios => Set<Testimonio>();

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
    }
}
