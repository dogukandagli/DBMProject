using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class mg10d : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Offer_LenderId",
                table: "Offer",
                column: "LenderId");

            migrationBuilder.CreateIndex(
                name: "IX_BorrowRequest_BorrowerId",
                table: "BorrowRequest",
                column: "BorrowerId");

            migrationBuilder.AddForeignKey(
                name: "FK_BorrowRequest_AspNetUsers_BorrowerId",
                table: "BorrowRequest",
                column: "BorrowerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Offer_AspNetUsers_LenderId",
                table: "Offer",
                column: "LenderId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BorrowRequest_AspNetUsers_BorrowerId",
                table: "BorrowRequest");

            migrationBuilder.DropForeignKey(
                name: "FK_Offer_AspNetUsers_LenderId",
                table: "Offer");

            migrationBuilder.DropIndex(
                name: "IX_Offer_LenderId",
                table: "Offer");

            migrationBuilder.DropIndex(
                name: "IX_BorrowRequest_BorrowerId",
                table: "BorrowRequest");
        }
    }
}
