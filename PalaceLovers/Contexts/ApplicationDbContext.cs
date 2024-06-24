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
        public DbSet<Rating> Ratings { get; set; }
        public DbSet<Gallery> Galleries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Palace>()
                .HasOne(p => p.User)
                .WithMany(u => u.Palaces)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Rating>()
                .HasOne(r => r.Palace)
                .WithMany(p => p.Ratings)
                .HasForeignKey(r => r.PalaceId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Gallery>()
                .HasOne(g => g.Palace)
                .WithMany(p => p.Galleries)
                .HasForeignKey(g => g.PalaceId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
