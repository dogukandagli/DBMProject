using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class mg19d : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Message_ConversationId",
                table: "Message");

            migrationBuilder.DropIndex(
                name: "IX_ConversationParticipants_ConversationId",
                table: "ConversationParticipants");

            migrationBuilder.DropIndex(
                name: "IX_Conversation_RelatedEntityId",
                table: "Conversation");

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "LastReadAt",
                table: "ConversationParticipants",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "LastMessageSenderId",
                table: "Conversation",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Message_ConversationId_CreatedAt",
                table: "Message",
                columns: new[] { "ConversationId", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_ConversationParticipants_ConversationId_UserId",
                table: "ConversationParticipants",
                columns: new[] { "ConversationId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Conversation_LastMessageAt",
                table: "Conversation",
                column: "LastMessageAt");

            migrationBuilder.CreateIndex(
                name: "IX_Conversation_LastMessageSenderId",
                table: "Conversation",
                column: "LastMessageSenderId");

            migrationBuilder.CreateIndex(
                name: "IX_Conversation_RelatedEntityId",
                table: "Conversation",
                column: "RelatedEntityId",
                unique: true,
                filter: "[RelatedEntityId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Conversation_AspNetUsers_LastMessageSenderId",
                table: "Conversation",
                column: "LastMessageSenderId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Conversation_AspNetUsers_LastMessageSenderId",
                table: "Conversation");

            migrationBuilder.DropIndex(
                name: "IX_Message_ConversationId_CreatedAt",
                table: "Message");

            migrationBuilder.DropIndex(
                name: "IX_ConversationParticipants_ConversationId_UserId",
                table: "ConversationParticipants");

            migrationBuilder.DropIndex(
                name: "IX_Conversation_LastMessageAt",
                table: "Conversation");

            migrationBuilder.DropIndex(
                name: "IX_Conversation_LastMessageSenderId",
                table: "Conversation");

            migrationBuilder.DropIndex(
                name: "IX_Conversation_RelatedEntityId",
                table: "Conversation");

            migrationBuilder.DropColumn(
                name: "LastReadAt",
                table: "ConversationParticipants");

            migrationBuilder.DropColumn(
                name: "LastMessageSenderId",
                table: "Conversation");

            migrationBuilder.CreateIndex(
                name: "IX_Message_ConversationId",
                table: "Message",
                column: "ConversationId");

            migrationBuilder.CreateIndex(
                name: "IX_ConversationParticipants_ConversationId",
                table: "ConversationParticipants",
                column: "ConversationId");

            migrationBuilder.CreateIndex(
                name: "IX_Conversation_RelatedEntityId",
                table: "Conversation",
                column: "RelatedEntityId");
        }
    }
}
