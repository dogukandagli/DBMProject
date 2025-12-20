using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class mg18d : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_LoanTransaction_BorrowerId",
                table: "LoanTransaction");

            migrationBuilder.CreateIndex(
                name: "IX_LoanTransaction_BorrowerId",
                table: "LoanTransaction",
                column: "BorrowerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_LoanTransaction_BorrowerId",
                table: "LoanTransaction");

            migrationBuilder.CreateIndex(
                name: "IX_LoanTransaction_BorrowerId",
                table: "LoanTransaction",
                column: "BorrowerId",
                unique: true,
                filter: "[IsDeleted] = 0");
        }
    }
}
