using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class mg14d : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LoanTransaction",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BorrowRequestId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BorrowerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LenderId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    LoanStartDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LoanEndDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    PickupCompletedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    PickupLatitude = table.Column<double>(type: "float(18)", precision: 18, scale: 10, nullable: true),
                    PickupLongitude = table.Column<double>(type: "float(18)", precision: 18, scale: 10, nullable: true),
                    ReturnCompletedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    ReturnLatitude = table.Column<double>(type: "float(18)", precision: 18, scale: 10, nullable: true),
                    ReturnLongitude = table.Column<double>(type: "float(18)", precision: 18, scale: 10, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoanTransaction", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LoanTransaction_AspNetUsers_BorrowerId",
                        column: x => x.BorrowerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LoanTransaction_AspNetUsers_LenderId",
                        column: x => x.LenderId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LoanTransaction_BorrowRequest_BorrowRequestId",
                        column: x => x.BorrowRequestId,
                        principalTable: "BorrowRequest",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LoanTransaction_BorrowerId",
                table: "LoanTransaction",
                column: "BorrowerId",
                unique: true,
                filter: "[IsDeleted] = 0");

            migrationBuilder.CreateIndex(
                name: "IX_LoanTransaction_BorrowRequestId",
                table: "LoanTransaction",
                column: "BorrowRequestId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LoanTransaction_LenderId",
                table: "LoanTransaction",
                column: "LenderId");

            migrationBuilder.CreateIndex(
                name: "IX_LoanTransaction_Status",
                table: "LoanTransaction",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LoanTransaction");
        }
    }
}
