using Microsoft.EntityFrameworkCore;
using PostManagementAPI.Models;

namespace PostManagementAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Movie> Movies { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Movie>()
                .HasIndex(m => m.Title);
            
            modelBuilder.Entity<Movie>()
                .HasIndex(m => m.Genre);
        }
    }
}
