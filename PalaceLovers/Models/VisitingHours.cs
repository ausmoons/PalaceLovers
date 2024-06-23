using System.ComponentModel.DataAnnotations;

namespace PalaceLovers.Models
{
    public class VisitingHours
    {
        [Key]
        public int VisitingHoursId { get; set; }

        [Required]
        public int PalaceId { get; set; }
        public Palace Palace { get; set; }

        [Required]
        [MaxLength(50)]
        public string DayOfWeek { get; set; }

        [Required]
        public TimeSpan OpenTime { get; set; }

        [Required]
        public TimeSpan CloseTime { get; set; }

        public string Notes { get; set; }
    }
}
