using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations;

/// <inheritdoc />
public partial class mg5d : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateIndex(
            name: "IX_Reaction_CreatedBy",
            table: "Reaction",
            column: "CreatedBy");

        migrationBuilder.AddForeignKey(
            name: "FK_Reaction_AspNetUsers_CreatedBy",
            table: "Reaction",
            column: "CreatedBy",
            principalTable: "AspNetUsers",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict);
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(
            name: "FK_Reaction_AspNetUsers_CreatedBy",
            table: "Reaction");

        migrationBuilder.DropIndex(
            name: "IX_Reaction_CreatedBy",
            table: "Reaction");
    }
}
