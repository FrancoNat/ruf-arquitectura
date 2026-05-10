using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RufApi.Migrations
{
    /// <inheritdoc />
    public partial class AddProyectoIncluyeItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "proyecto_incluye_items",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Titulo = table.Column<string>(type: "character varying(180)", maxLength: 180, nullable: false),
                    Descripcion = table.Column<string>(type: "text", nullable: false),
                    ItemsJson = table.Column<string>(type: "text", nullable: false),
                    Orden = table.Column<int>(type: "integer", nullable: false),
                    ProyectoId = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_proyecto_incluye_items", x => x.Id);
                    table.ForeignKey(
                        name: "FK_proyecto_incluye_items_proyectos_ProyectoId",
                        column: x => x.ProyectoId,
                        principalTable: "proyectos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_proyecto_incluye_items_ProyectoId",
                table: "proyecto_incluye_items",
                column: "ProyectoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "proyecto_incluye_items");
        }
    }
}
