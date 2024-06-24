using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace PalaceLovers.Models
{
    public class User : IdentityUser
    {
        [Required]
        [MaxLength(255)]
        public string CustomUsername { get; set; }

        public DateTime CreateDate { get; set; }
        public DateTime LastLoginDate { get; set; }

        // Define the relationship with Palaces
        public ICollection<Palace> Palaces { get; set; }
    }
}
