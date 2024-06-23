using System.ComponentModel.DataAnnotations;

namespace PalaceLovers.Models
{
    public class Role
    {
        [Key]
        public int RoleId { get; set; }

        [Required]
        [MaxLength(255)]
        public string RoleName { get; set; }

        public string Description { get; set; }
    }
}
