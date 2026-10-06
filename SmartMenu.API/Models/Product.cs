namespace SmartMenu.API.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsPopular { get; set; } = false;
        public bool IsNew { get; set; } = false;
        public string? Allergens { get; set; }

        // Kategori ile bağlama (İlişki)
        public int CategoryId { get; set; }
        public Category? Category { get; set; }
    }
}