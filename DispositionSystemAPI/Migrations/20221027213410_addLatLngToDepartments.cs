using Microsoft.EntityFrameworkCore.Migrations;

namespace DispositionSystemAPI.Migrations
{
    public partial class addLatLngToDepartments : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Lat",
                table: "Departments",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Lng",
                table: "Departments",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Lat",
                table: "Departments");

            migrationBuilder.DropColumn(
                name: "Lng",
                table: "Departments");
        }
    }
}
