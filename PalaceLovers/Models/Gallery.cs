namespace PalaceLovers.Models
{
    public class Gallery
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; }
        public DateTime UploadDate { get; set; }

        public int PalaceId { get; set; }
        public Palace Palace { get; set; }
    }

}
