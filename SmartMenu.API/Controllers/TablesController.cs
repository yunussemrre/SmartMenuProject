using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartMenu.API.Data;
using SmartMenu.API.Models;

namespace SmartMenu.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TablesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TablesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Tables
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Table>>> GetTables()
        {
            return await _context.Tables.ToListAsync();
        }

        // GET: api/Tables/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Table>> GetTable(int id)
        {
            var table = await _context.Tables.FindAsync(id);
            if (table == null) return NotFound();
            return table;
        }

        // api/Tables/ByCode/QR1
        [HttpGet("ByCode/{code}")]
        public async Task<ActionResult<Table>> GetTableByCode(string code)
        {
            var table = await _context.Tables.FirstOrDefaultAsync(t => t.QRKey == code);
            if (table == null) return NotFound();
            return table;
        }

        // PUT: api/Tables/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTable(int id, Table table)
        {
            if (id != table.Id) return BadRequest();
            _context.Entry(table).State = EntityState.Modified;
            try { await _context.SaveChangesAsync(); }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Tables.Any(e => e.Id == id)) return NotFound();
                else throw;
            }
            return NoContent();
        }

        // POST: api/Tables (YENİLENMİŞ - OTOMATİK QR ÜRETEN)
        [HttpPost]
        public async Task<ActionResult<Table>> PostTable(Table table)
        {
            // Eğer QR kodu boşsa sistem otomatik üretir
            if (string.IsNullOrEmpty(table.QRKey))
            {
                table.QRKey = Guid.NewGuid().ToString().Substring(0, 8).ToUpper();
            }

            _context.Tables.Add(table);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetTable", new { id = table.Id }, table);
        }

        // DELETE: api/Tables/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTable(int id)
        {
            var table = await _context.Tables.FindAsync(id);
            if (table == null) return NotFound();
            _context.Tables.Remove(table);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // 🟢 MASAYI AKTİF ET (Garsonun kullandığı)
        [HttpPost("{id}/activate")]
        public async Task<IActionResult> ActivateTable(int id)
        {
            var table = await _context.Tables.FindAsync(id);
            if (table == null) return NotFound();

            table.IsOccupied = true;
            // table.IsActive = true; // Eğer modelinde IsActive varsa bunu aç

            // Güvenlik için o anki müşteriye özel token
            // table.CurrentSessionToken = Guid.NewGuid().ToString().Substring(0, 8); 

            await _context.SaveChangesAsync();
            return Ok(new { message = "Masa aktif edildi" });
        }

        // 🔵 TABLET İÇİN AKTİVASYON KODU ÜRET (Adminin kullandığı)
        [HttpPost("{id}/generate-code")]
        public async Task<IActionResult> GenerateCode(int id)
        {
            var table = await _context.Tables.FindAsync(id);
            if (table == null) return NotFound();

            // 5 Haneli rastgele kod üret (Örn: A7B2X)
            string code = Guid.NewGuid().ToString().Substring(0, 5).ToUpper();
            table.ActivationCode = code;

            await _context.SaveChangesAsync();
            return Ok(new { code = code });
        }

        // 🟡 KOD DOĞRULAMA (Tabletin kurulumda kullandığı)
        [HttpPost("verify-code/{code}")]
        public async Task<IActionResult> VerifyCode(string code)
        {
            var table = await _context.Tables.FirstOrDefaultAsync(t => t.ActivationCode == code);
            if (table == null) return BadRequest("Geçersiz Aktivasyon Kodu!");

            // Kod bir kez kullanıldıktan sonra temizlensin (Güvenlik)
            table.ActivationCode = null;
            await _context.SaveChangesAsync();

            return Ok(new { tableId = table.Id, tableName = table.TableNumber });
        }
    }
}