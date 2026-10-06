using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartMenu.API.Data;

[Route("api/[controller]")]
[ApiController]
public class AnalyticsController : ControllerBase
{
    private readonly AppDbContext _context;
    public AnalyticsController(AppDbContext context) => _context = context;

    [HttpGet("TopProducts")]
    public async Task<IActionResult> GetTopProducts()
    {
        var data = await _context.OrderItems
            .Include(oi => oi.Product)
            .GroupBy(oi => oi.Product.Name)
            .Select(g => new { Name = g.Key, Count = g.Sum(x => x.Quantity) })
            .OrderByDescending(x => x.Count)
            .Take(5)
            .ToListAsync();
        return Ok(data);
    }

    [HttpGet("HourlyTraffic")]
    public async Task<IActionResult> GetHourlyTraffic()
    {
        var data = await _context.Orders
            .GroupBy(o => o.OrderDate.Hour)
            .Select(g => new { Hour = g.Key, Count = g.Count() })
            .OrderBy(x => x.Hour)
            .ToListAsync();
        return Ok(data);
    }
}