using Microsoft.EntityFrameworkCore.Migrations;

namespace DispositionSystemAPI.Migrations
{
    public partial class deleteCreatedBy : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Departments_Users_CreatedById",
                table: "Departments");

            migrationBuilder.DropIndex(
                name: "IX_Departments_CreatedById",
                table: "Departments");

            migrationBuilder.DropColumn(
                name: "CreatedById",
                table: "Departments");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CreatedById",
                table: "Departments",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Departments_CreatedById",
                table: "Departments",
                column: "CreatedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Departments_Users_CreatedById",
                table: "Departments",
                column: "CreatedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
