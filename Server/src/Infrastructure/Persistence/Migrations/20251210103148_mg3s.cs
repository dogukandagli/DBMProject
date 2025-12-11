using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class mg3s : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventParticipant_Event_EventId1",
                table: "EventParticipant");

            migrationBuilder.DropIndex(
                name: "IX_EventParticipant_EventId1",
                table: "EventParticipant");

            migrationBuilder.DropColumn(
                name: "EventId1",
                table: "EventParticipant");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "EventId1",
                table: "EventParticipant",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_EventParticipant_EventId1",
                table: "EventParticipant",
                column: "EventId1");

            migrationBuilder.AddForeignKey(
                name: "FK_EventParticipant_Event_EventId1",
                table: "EventParticipant",
                column: "EventId1",
                principalTable: "Event",
                principalColumn: "Id");
        }
    }
}
