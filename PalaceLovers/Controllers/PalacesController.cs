using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using PalaceLovers.Context;
using PalaceLovers.Models;
using PalaceLovers.Services;
using System.Security.Claims;

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


        [HttpGet("{id}")]
        public async Task<ActionResult<Palace>> GetPalace(int id)
        {
            var palace = await _context.Palaces
                .Include(p => p.Galleries)
                .Include(p => p.Ratings)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (palace == null)
            {
                return NotFound();
            }

            return palace;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Palace>>> GetPalaces(string sortBy = "name")
        {
            IQueryable<Palace> query = _context.Palaces.Include(p => p.Galleries).Include(p => p.Ratings);

            switch (sortBy.ToLower())
            {
                case "rating":
                    query = query.OrderByDescending(p => p.Ratings.Any() ? p.Ratings.Average(r => r.Score) : 0);
                    break;
                case "date":
                    query = query.OrderByDescending(p => p.AddedDate);
                    break;
                default:
                    query = query.OrderBy(p => p.Name);
                    break;
            }

            return await query.ToListAsync();
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Palace>> AddPalace([FromForm] PalaceDto palaceDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var palace = new Palace
            {
                Name = palaceDto.Name,
                Location = palaceDto.Location,
                Latitude = palaceDto.Latitude,
                Longitude = palaceDto.Longitude,
                History = palaceDto.History,
                YearBuilt = palaceDto.YearBuilt,
                VisitingHours = palaceDto.VisitingHours,
                Galleries = new List<Gallery>(),
                UserId = userId
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

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPalace(int id, [FromForm] PalaceDto palaceDto)
        {
            Console.WriteLine($"PutPalace called with id: {id}");
            Console.WriteLine($"PalaceDto: {JsonConvert.SerializeObject(palaceDto)}");

            var palace = await _context.Palaces.Include(p => p.Galleries).FirstOrDefaultAsync(p => p.Id == id);
            if (palace == null)
            {
                Console.WriteLine("Palace not found");
                return NotFound();
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = User.IsInRole("Admin");

            if (palace.UserId != userId && !isAdmin)
            {
                Console.WriteLine("User not authorized");
                return Forbid();
            }

            palace.Name = palaceDto.Name;
            palace.Location = palaceDto.Location;
            palace.Latitude = palaceDto.Latitude;
            palace.Longitude = palaceDto.Longitude;
            palace.History = palaceDto.History;
            palace.YearBuilt = palaceDto.YearBuilt;
            palace.VisitingHours = palaceDto.VisitingHours;

            if (palaceDto.ImagesToRemove != null && palaceDto.ImagesToRemove.Count > 0)
            {
                foreach (var imageUrl in palaceDto.ImagesToRemove)
                {
                    var gallery = palace.Galleries.FirstOrDefault(g => g.ImageUrl == imageUrl);
                    if (gallery != null)
                    {
                        _context.Galleries.Remove(gallery);
                    }
                }
            }

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
                Console.WriteLine("Palace updated successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving palace: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }

            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePalace(int id)
        {
            var palace = await _context.Palaces
                .Include(p => p.Galleries)
                .Include(p => p.Ratings)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (palace == null)
            {
                return NotFound();
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = User.IsInRole("Admin");

            if (palace.UserId != userId && !isAdmin)
            {
                return Forbid();
            }

            // Remove related entities first
            _context.Galleries.RemoveRange(palace.Galleries);
            _context.Ratings.RemoveRange(palace.Ratings);

            _context.Palaces.Remove(palace);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }

            return NoContent();
        }

        private bool PalaceExists(int id)
        {
            return _context.Palaces.Any(e => e.Id == id);
        }
    }
}
