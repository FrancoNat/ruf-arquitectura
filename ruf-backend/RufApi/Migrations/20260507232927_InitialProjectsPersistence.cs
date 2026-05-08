using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RufApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialProjectsPersistence : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "proyectos",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Titulo = table.Column<string>(type: "character varying(180)", maxLength: 180, nullable: false),
                    Slug = table.Column<string>(type: "character varying(180)", maxLength: 180, nullable: false),
                    Categoria = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    DescripcionCorta = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    DescripcionLarga = table.Column<string>(type: "text", nullable: false),
                    Ubicacion = table.Column<string>(type: "character varying(180)", maxLength: 180, nullable: false),
                    Anio = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Superficie = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    Estado = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    Destacado = table.Column<bool>(type: "boolean", nullable: false),
                    ImagenPrincipal = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Alt = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_proyectos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "proyecto_imagenes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Alt = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: false),
                    Orden = table.Column<int>(type: "integer", nullable: false),
                    ProyectoId = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_proyecto_imagenes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_proyecto_imagenes_proyectos_ProyectoId",
                        column: x => x.ProyectoId,
                        principalTable: "proyectos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_proyecto_imagenes_ProyectoId",
                table: "proyecto_imagenes",
                column: "ProyectoId");

            migrationBuilder.CreateIndex(
                name: "IX_proyectos_Slug",
                table: "proyectos",
                column: "Slug",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "proyecto_imagenes");

            migrationBuilder.DropTable(
                name: "proyectos");
        }
    }
}
