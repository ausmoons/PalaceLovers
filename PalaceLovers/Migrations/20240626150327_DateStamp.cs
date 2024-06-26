using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PalaceLovers.Migrations
{
    /// <inheritdoc />
    public partial class DateStamp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "AddedDate",
                table: "Palaces",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETDATE()");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AddedDate",
                table: "Palaces");
        }
    }
}
