using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PalaceLovers.Context;
using PalaceLovers.Models;
using PalaceLovers.Services;

namespace PalaceLovers.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PalacesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ImageService _imageService;

        public PalacesController(ApplicationDbContext context, ImageService imageService)
        {
            _context = context;
            _imageService = imageService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Palace>>> GetPalaces()
        {
            return await _context.Palaces.Include(p => p.Galleries).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Palace>> GetPalace(int id)
        {
            var palace = await _context.Palaces
                .Include(p => p.Galleries)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (palace == null)
            {
                return NotFound();
            }

            return palace;
        }

        [HttpPost]
        public async Task<ActionResult<Palace>> AddPalace([FromForm] PalaceDto palaceDto)
        {
            var palace = new Palace
            {
                Name = palaceDto.Name,
                Location = palaceDto.Location,
                History = palaceDto.History,
                YearBuilt = palaceDto.YearBuilt,
                VisitingHours = palaceDto.VisitingHours,
                Galleries = new List<Gallery>()
            };

            if (palaceDto.Images != null && palaceDto.Images.Count > 0)
            {
                foreach (var image in palaceDto.Images)
                {
                    var imageUrl = await _imageService.SaveImageAsync(image);
                    palace.Galleries.Add(new Gallery { ImageUrl = imageUrl, UploadDate = DateTime.Now });
                }
            }

            _context.Palaces.Add(palace);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPalace", new { id = palace.Id }, palace);
        }

        [HttpPost("{palaceId}/images")]
        public async Task<IActionResult> UploadImages(int palaceId, List<IFormFile> images)
        {
            var palace = await _context.Palaces.Include(p => p.Galleries).FirstOrDefaultAsync(p => p.Id == palaceId);
            if (palace == null)
            {
                return NotFound();
            }

            foreach (var image in images)
            {
                if (image.Length > 0)
                {
                    var imageUrl = await _imageService.SaveImageAsync(image);
                    palace.Galleries.Add(new Gallery { ImageUrl = imageUrl });
                }
            }

            await _context.SaveChangesAsync();
            return Ok(palace);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPalace(int id, [FromForm] PalaceDto palaceDto)
        {
            var palace = await _context.Palaces.Include(p => p.Galleries).FirstOrDefaultAsync(p => p.Id == id);
            if (palace == null)
            {
                return NotFound();
            }

            palace.Name = palaceDto.Name;
            palace.Location = palaceDto.Location;
            palace.History = palaceDto.History;
            palace.YearBuilt = palaceDto.YearBuilt;
            palace.VisitingHours = palaceDto.VisitingHours;

            if (palaceDto.Images != null && palaceDto.Images.Count > 0)
            {
                foreach (var image in palaceDto.Images)
                {
                    var imageUrl = await _imageService.SaveImageAsync(image);
                    palace.Galleries.Add(new Gallery { ImageUrl = imageUrl, UploadDate = DateTime.Now });
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Log the error
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
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
