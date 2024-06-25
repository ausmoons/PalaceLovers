using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PalaceLovers.Context;
using PalaceLovers.Models;
using System.Security.Claims;

namespace PalaceLovers.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RatingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RatingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{palaceId}")]
        public async Task<ActionResult<IEnumerable<Rating>>> GetRatings(int palaceId)
        {
            var ratings = await _context.Ratings
                .Where(r => r.PalaceId == palaceId)
                .Include(r => r.User)
                .ToListAsync();

            if (ratings == null)
            {
                return NotFound();
            }

            return ratings;
        }

        [Authorize]
        [HttpPost("{palaceId}")]
        public async Task<ActionResult<Rating>> AddRating(int palaceId, [FromBody] RatingDto ratingDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var rating = new Rating
            {
                PalaceId = palaceId,
                UserId = userId,
                Score = ratingDto.Score,
                Comment = ratingDto.Comment,
                RatingDate = DateTime.Now
            };

            _context.Ratings.Add(rating);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRatings), new { palaceId = rating.PalaceId }, rating);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRating(int id, [FromBody] RatingDto ratingDto)
        {
            var rating = await _context.Ratings.FindAsync(id);
            if (rating == null)
            {
                return NotFound();
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (rating.UserId != userId)
            {
                return Forbid();
            }

            rating.Score = ratingDto.Score;
            rating.Comment = ratingDto.Comment;
            rating.RatingDate = DateTime.Now;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RatingExists(id))
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

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRating(int id)
        {
            var rating = await _context.Ratings.FindAsync(id);
            if (rating == null)
            {
                return NotFound();
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (rating.UserId != userId)
            {
                return Forbid();
            }

            _context.Ratings.Remove(rating);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RatingExists(int id)
        {
            return _context.Ratings.Any(e => e.RatingId == id);
        }
    }
}

