namespace SmartMenu.API.Models
{
    public class Table
    {
        public int Id { get; set; }
        public string TableNumber { get; set; } = string.Empty; // Masa 1, Masa 2...
        public string QRKey { get; set; } = Guid.NewGuid().ToString().Substring(0, 8); // QR için özel kod
        public string? CurrentSessionToken { get; set; } // O anki müşterinin gizli anahtarı
        public string? ActivationCode { get; set; } // Örn: "8F72K"
        public bool IsActive { get; set; } = false; // Garson masayı açtı mı?
        public bool IsOccupied { get; set; } = false; // Masa dolu mu?
    }
}
