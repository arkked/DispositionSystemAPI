using Microsoft.EntityFrameworkCore.Migrations;

namespace DispositionSystemAPI.Migrations
{
    public partial class NotificationCoordsAdd : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Content",
                table: "Notifications",
                newName: "Name");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Notifications",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Lat",
                table: "Notifications",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Lng",
                table: "Notifications",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "Lat",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "Lng",
                table: "Notifications");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Notifications",
                newName: "Content");
        }
    }
}
