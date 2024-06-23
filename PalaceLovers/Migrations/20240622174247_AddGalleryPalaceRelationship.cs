using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PalaceLovers.Migrations
{
    /// <inheritdoc />
    public partial class AddGalleryPalaceRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VisitingHours");

            migrationBuilder.DropColumn(
                name: "ImageURL",
                table: "Palaces");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Galleries");

            migrationBuilder.RenameColumn(
                name: "GalleryId",
                table: "Galleries",
                newName: "Id");

            migrationBuilder.AlterColumn<string>(
                name: "ImageUrl",
                table: "Galleries",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Galleries",
                newName: "GalleryId");

            migrationBuilder.AddColumn<string>(
                name: "ImageURL",
                table: "Palaces",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "ImageUrl",
                table: "Galleries",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Galleries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "VisitingHours",
                columns: table => new
                {
                    VisitingHoursId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PalaceId = table.Column<int>(type: "int", nullable: false),
                    CloseTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    DayOfWeek = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OpenTime = table.Column<TimeSpan>(type: "time", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VisitingHours", x => x.VisitingHoursId);
                    table.ForeignKey(
                        name: "FK_VisitingHours_Palaces_PalaceId",
                        column: x => x.PalaceId,
                        principalTable: "Palaces",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VisitingHours_PalaceId",
                table: "VisitingHours",
                column: "PalaceId");
        }
    }
}
