using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNeighborhoodEdgeTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "NeighborhoodEdge",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FromNeighborhoodId = table.Column<int>(type: "int", nullable: false),
                    ToNeighborhoodId = table.Column<int>(type: "int", nullable: false),
                    DistanceKm = table.Column<double>(type: "float", nullable: false),
                    IsBidirectional = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NeighborhoodEdge", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NeighborhoodEdge_Neighborhood_FromNeighborhoodId",
                        column: x => x.FromNeighborhoodId,
                        principalTable: "Neighborhood",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_NeighborhoodEdge_Neighborhood_ToNeighborhoodId",
                        column: x => x.ToNeighborhoodId,
                        principalTable: "Neighborhood",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_NeighborhoodEdge_FromNeighborhoodId",
                table: "NeighborhoodEdge",
                column: "FromNeighborhoodId");

            migrationBuilder.CreateIndex(
                name: "IX_NeighborhoodEdge_ToNeighborhoodId",
                table: "NeighborhoodEdge",
                column: "ToNeighborhoodId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NeighborhoodEdge");
        }
    }
}
