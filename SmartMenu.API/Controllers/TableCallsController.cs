using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SmartMenu.API.Data;
using SmartMenu.API.Hubs;
using SmartMenu.API.Models;

namespace SmartMenu.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TableCallsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<MenuHub> _hubContext; // SignalR Kapısı

        public TableCallsController(AppDbContext context, IHubContext<MenuHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TableCall>>> GetTableCalls() => await _context.TableCalls.ToListAsync();

        [HttpPost]
        public async Task<ActionResult<TableCall>> PostTableCall(TableCall tableCall)
        {
            _context.TableCalls.Add(tableCall);
            await _context.SaveChangesAsync();

            // 📢 TÜM PERSONELE ANLIK HABER VER!
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", $"{tableCall.TableNo} bir {tableCall.CallType} istiyor!");

            return CreatedAtAction("GetTableCall", new { id = tableCall.Id }, tableCall);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TableCall>> GetTableCall(int id)
        {
            var call = await _context.TableCalls.FindAsync(id);
            return call == null ? NotFound() : call;
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTableCall(int id)
        {
            var call = await _context.TableCalls.FindAsync(id);
            if (call == null) return NotFound();
            _context.TableCalls.Remove(call);
            await _context.SaveChangesAsync();

            // 📢 ÇAĞRI SİLİNDİĞİNDE DE HABER VER (Ekranlar güncellensin)
            await _hubContext.Clients.All.SendAsync("RefreshCalls");

            return NoContent();
        }

        // --- 🏃 GARSON ÇAĞRIYI SAHİPLENME METODU ---
        [HttpPatch("{id}/assign")]
        public async Task<IActionResult> AssignWaiter(int id, [FromBody] string waiterName)
        {
            var call = await _context.TableCalls.FindAsync(id);
            if (call == null) return NotFound();

            call.AssignedWaiter = waiterName; // Modelinde bu alan olmalı
            await _context.SaveChangesAsync();

            // 📢 DİĞER GARSONLARA "BEN GİDİYORUM" HABERİ GÖNDER
            await _hubContext.Clients.All.SendAsync("WaiterAssigned", new { callId = id, name = waiterName });

            return Ok();
        }
    }
}