using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddOsmFieldsToNeighborhood : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "Neighborhood",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "Neighborhood",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "OsmRelationId",
                table: "Neighborhood",
                type: "bigint",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Neighborhood");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Neighborhood");

            migrationBuilder.DropColumn(
                name: "OsmRelationId",
                table: "Neighborhood");
        }
    }
}
