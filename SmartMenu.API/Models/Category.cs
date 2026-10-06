namespace SmartMenu.API.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public int OrderNo { get; set; }
        public bool IsActive { get; set; } = true;

        // Bir kategoride birden fazla ürün olabilir
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}