using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PalaceLovers.Context;
using PalaceLovers.Models;

namespace PalaceLovers.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PalacesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PalacesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Palace>>> GetPalaces()
        {
            return await _context.Palaces.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Palace>> GetPalace(int id)
        {
            var palace = await _context.Palaces.FindAsync(id);

            if (palace == null)
            {
                return NotFound();
            }

            return palace;
        }

        [HttpPost("postPalace")]
        public async Task<IActionResult> PostPalace([FromBody] Palace palace)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Palaces.Add(palace);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPalace), new { id = palace.Id }, palace);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPalace(int id, Palace palace)
        {
            if (id != palace.Id)
            {
                return BadRequest();
            }

            _context.Entry(palace).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PalaceExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePalace(int id)
        {
            var palace = await _context.Palaces.FindAsync(id);
            if (palace == null)
            {
                return NotFound();
            }

            _context.Palaces.Remove(palace);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PalaceExists(int id)
        {
            return _context.Palaces.Any(e => e.Id == id);
        }
    }
}

