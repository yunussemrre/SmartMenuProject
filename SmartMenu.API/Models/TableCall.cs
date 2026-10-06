namespace SmartMenu.API.Models
{
    public class TableCall
    {
        public int Id { get; set; }
        public string TableNo { get; set; } = "Masa 1"; // Şimdilik sabit
        public string CallType { get; set; } = "Garson"; // "Garson" veya "Hesap"
        public DateTime CallTime { get; set; } = DateTime.Now;
        public string? AssignedWaiter { get; set; }
        public bool IsHandled { get; set; } = false; // Garson ilgilendi mi?
    }
}
