using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication2.Migrations
{
    /// <inheritdoc />
    public partial class RemoveProveedorIdFromProducto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProveedorId",
                table: "categorias",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_categorias_ProveedorId",
                table: "categorias",
                column: "ProveedorId");

            migrationBuilder.AddForeignKey(
                name: "FK_categorias_proveedores_ProveedorId",
                table: "categorias",
                column: "ProveedorId",
                principalTable: "proveedores",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_categorias_proveedores_ProveedorId",
                table: "categorias");

            migrationBuilder.DropIndex(
                name: "IX_categorias_ProveedorId",
                table: "categorias");

            migrationBuilder.DropColumn(
                name: "ProveedorId",
                table: "categorias");
        }
    }
}
