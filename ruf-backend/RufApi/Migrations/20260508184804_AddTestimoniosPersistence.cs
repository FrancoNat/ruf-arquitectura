using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RufApi.Migrations
{
    /// <inheritdoc />
    public partial class AddTestimoniosPersistence : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "testimonios",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Nombre = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    TipoProyecto = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Texto = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Estrellas = table.Column<int>(type: "integer", nullable: false),
                    Foto = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Estado = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    MostrarEnHome = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_testimonios", x => x.Id);
                    table.CheckConstraint("CK_testimonios_estado", "\"Estado\" IN ('activo', 'inactivo')");
                    table.CheckConstraint("CK_testimonios_estrellas", "\"Estrellas\" >= 1 AND \"Estrellas\" <= 5");
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "testimonios");
        }
    }
}
