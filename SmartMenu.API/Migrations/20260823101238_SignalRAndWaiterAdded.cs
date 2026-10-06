using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartMenu.API.Migrations
{
    /// <inheritdoc />
    public partial class SignalRAndWaiterAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AssignedWaiter",
                table: "TableCalls",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WaiterName",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AssignedWaiter",
                table: "TableCalls");

            migrationBuilder.DropColumn(
                name: "WaiterName",
                table: "Orders");
        }
    }
}
