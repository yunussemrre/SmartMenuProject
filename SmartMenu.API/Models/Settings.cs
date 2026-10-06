namespace SmartMenu.API.Models
{
    public class Settings
    {
        public int Id { get; set; }
        public string RestaurantName { get; set; } = "SmartMenu";
        public string? LogoUrl { get; set; }
        public string? WifiPassword { get; set; }
        public string PrimaryColor { get; set; } = "#ea580c"; 
    }
}
