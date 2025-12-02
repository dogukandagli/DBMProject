using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class mg3d : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PhotoUrl",
                table: "AspNetUsers",
                newName: "ProfilePhotoUrl");

            migrationBuilder.AddColumn<string>(
                name: "CoverPhotoUrl",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CoverPhotoUrl",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "ProfilePhotoUrl",
                table: "AspNetUsers",
                newName: "PhotoUrl");
        }
    }
}
