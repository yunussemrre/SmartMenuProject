namespace SmartMenu.API.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int TableId { get; set; }
        public Table? Table { get; set; } // Soru işareti ekledik
        public DateTime OrderDate { get; set; } = DateTime.Now;
        public decimal TotalPrice { get; set; }
        public bool IsPaid { get; set; } = false;
        public string Status { get; set; } = "Pending";
        public string? WaiterName { get; set; }

        // Soru işareti ekledik
        public ICollection<OrderItem>? OrderItems { get; set; } = new List<OrderItem>();
    }
}
