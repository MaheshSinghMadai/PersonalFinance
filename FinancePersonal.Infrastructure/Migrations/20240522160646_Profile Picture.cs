using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinancePersonal.Infrastructure.Migrations
{
    public partial class ProfilePicture : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ProfilePicturePath",
                table: "AspNetUsers",
                newName: "ProfilePicture");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ProfilePicture",
                table: "AspNetUsers",
                newName: "ProfilePicturePath");
        }
    }
}
