using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PalaceLovers.Models;

namespace PalaceLovers.Context
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Palace> Palaces { get; set; }
        public DbSet<Gallery> Galleries { get; set; }
        public DbSet<Rating> Ratings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure one-to-many relationship
            modelBuilder.Entity<Gallery>()
                .HasOne(g => g.Palace)
                .WithMany(p => p.Galleries)
                .HasForeignKey(g => g.PalaceId);
        }
    }
}
