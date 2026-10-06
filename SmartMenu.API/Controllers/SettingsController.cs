using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // FirstOrDefaultAsync için bu lazım
using SmartMenu.API.Data;
using SmartMenu.API.Models; // Settings sınıfı için bu lazım

namespace SmartMenu.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SettingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SettingsController(AppDbContext context)
        {
            _context = context;
        }

        // Ayarları Getir
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var settings = await _context.Settings.FirstOrDefaultAsync();
            if (settings == null) return Ok(new Settings()); // Eğer boşsa varsayılanı dön
            return Ok(settings);
        }

        // Ayarları Güncelle veya Oluştur
        [HttpPut]
        public async Task<IActionResult> Update(Settings settings)
        {
            var existing = await _context.Settings.FirstOrDefaultAsync();

            if (existing == null)
            {
                _context.Settings.Add(settings);
            }
            else
            {
                existing.RestaurantName = settings.RestaurantName;
                existing.LogoUrl = settings.LogoUrl;
                existing.WifiPassword = settings.WifiPassword;
                existing.PrimaryColor = settings.PrimaryColor;
            }

            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}