using System.ComponentModel.DataAnnotations;

namespace PalaceLovers.Models
{
    public class PalaceDto
    {
        public string Name { get; set; }
        public string Location { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string History { get; set; }
        public int YearBuilt { get; set; }
        public string VisitingHours { get; set; }
        public List<IFormFile> Images { get; set; } = new List<IFormFile>();
    }
}
