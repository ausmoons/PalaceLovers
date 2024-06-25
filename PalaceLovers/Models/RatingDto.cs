using System.ComponentModel.DataAnnotations;

namespace PalaceLovers.Models
{
    public class RatingDto
    {
        [Required]
        public int Score { get; set; }

        public string Comment { get; set; }
    }
}
