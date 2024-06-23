using System.ComponentModel.DataAnnotations;

namespace PalaceLovers.Models
{
    public class Rating
    {
        [Key]
        public int RatingId { get; set; }

        [Required]
        public int PalaceId { get; set; }
        public Palace Palace { get; set; }

        [Required]
        public string UserId { get; set; } // Ensure this matches the User's primary key type
        public User User { get; set; }

        [Required]
        public int Score { get; set; }

        public string Comment { get; set; }

        public DateTime RatingDate { get; set; }
    }
}
