using System.ComponentModel.DataAnnotations;

namespace PalaceLovers.Models
{
    public class Palace
    {
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; }

        [Required]
        public string Location { get; set; }
        public double Latitude { get; set; } 

        public double Longitude { get; set; }

        public string History { get; set; }

        public int YearBuilt { get; set; }

        public List<Rating> Ratings { get; set; } = new List<Rating>();

        public List<Gallery> Galleries { get; set; } = new List<Gallery>();

        public string VisitingHours { get; set; }

        // Foreign key property for User
        public string UserId { get; set; }

        // Navigation property for User
        public User User { get; set; }
        public DateTime AddedDate { get; set; } = DateTime.Now;
    }
}
