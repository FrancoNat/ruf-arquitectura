using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RufApi.Migrations
{
    /// <inheritdoc />
    public partial class AddAgendaPersistence : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "bloqueos_horarios",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Fecha = table.Column<DateOnly>(type: "date", nullable: false),
                    Hora = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    Motivo = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_bloqueos_horarios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "horarios_base",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Hora = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    Activo = table.Column<bool>(type: "boolean", nullable: false),
                    Orden = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_horarios_base", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "reuniones",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Nombre = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    TipoProyecto = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Fecha = table.Column<DateOnly>(type: "date", nullable: false),
                    Hora = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    Estado = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_reuniones", x => x.Id);
                    table.CheckConstraint("CK_reuniones_estado", "\"Estado\" IN ('pendiente', 'confirmada', 'cancelada')");
                });

            migrationBuilder.CreateIndex(
                name: "IX_bloqueos_horarios_Fecha_Hora",
                table: "bloqueos_horarios",
                columns: new[] { "Fecha", "Hora" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_horarios_base_Hora",
                table: "horarios_base",
                column: "Hora",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_reuniones_Fecha_Hora",
                table: "reuniones",
                columns: new[] { "Fecha", "Hora" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "bloqueos_horarios");

            migrationBuilder.DropTable(
                name: "horarios_base");

            migrationBuilder.DropTable(
                name: "reuniones");
        }
    }
}
