using System.Text.Json.Serialization;

namespace SmartMenu.API.Models
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }

        [JsonIgnore] // Döngüyü kırmak için buraya ekledik
        public Order? Order { get; set; }

        public int ProductId { get; set; }
        public Product? Product { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
