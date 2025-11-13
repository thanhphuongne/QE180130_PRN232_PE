using Microsoft.EntityFrameworkCore;
using MovieManagementAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure PostgreSQL Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? Environment.GetEnvironmentVariable("DATABASE_URL");

Console.WriteLine($"Original connection string: {connectionString}");

if (!string.IsNullOrEmpty(connectionString))
{
    // Handle postgresql:// connection string format
    if (connectionString.StartsWith("postgresql://") || connectionString.StartsWith("postgres://"))
    {
        connectionString = connectionString.Replace("postgresql://", "").Replace("postgres://", "");
        
        // Find the last @ which separates user:password from host
        var lastAtIndex = connectionString.LastIndexOf('@');
        if (lastAtIndex > 0)
        {
            var userInfo = connectionString.Substring(0, lastAtIndex);
            var hostInfo = connectionString.Substring(lastAtIndex + 1);
            
            var userParts = userInfo.Split(':');
            var username = userParts[0];
            var password = userParts.Length > 1 ? string.Join(":", userParts.Skip(1)) : "";
            
            var hostParts = hostInfo.Split('/');
            var hostAndPort = hostParts[0].Split(':');
            var host = hostAndPort[0];
            var port = hostAndPort.Length > 1 ? hostAndPort[1] : "5432";
            var database = hostParts.Length > 1 ? hostParts[1].Split('?')[0] : "postgres";
            
            connectionString = $"Host={host};Port={port};Database={database};Username={username};Password={password};SSL Mode=Require;Trust Server Certificate=true";
            Console.WriteLine($"Parsed connection string: Host={host};Port={port};Database={database};Username={username};SSL Mode=Require");
        }
    }
    else
    {
        Console.WriteLine("Using connection string as-is (not postgresql:// format)");
    }
}
else
{
    throw new InvalidOperationException("Database connection string is not configured.");
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.WithOrigins(
                       "https://qe-180130-prn-232-pe.vercel.app",
                       "http://localhost:3000"
                   )
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

var app = builder.Build();

// Apply migrations on startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    
    try
    {
        logger.LogInformation("Starting database migration...");
        var context = services.GetRequiredService<ApplicationDbContext>();
        
        // Check if database can be connected
        var canConnect = await context.Database.CanConnectAsync();
        logger.LogInformation($"Database connection test: {canConnect}");
        
        if (canConnect)
        {
            logger.LogInformation("Running migrations...");
            await context.Database.MigrateAsync();
            logger.LogInformation("Database migration completed successfully!");
            
            // Seed sample data if database is empty
            if (!context.Movies.Any())
            {
                logger.LogInformation("Seeding sample movie data...");
                var movies = new[]
                {
                    new MovieManagementAPI.Models.Movie
                    {
                        Title = "The Shawshank Redemption",
                        Genre = "Drama",
                        Rating = 5,
                        PosterUrl = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new MovieManagementAPI.Models.Movie
                    {
                        Title = "The Dark Knight",
                        Genre = "Action",
                        Rating = 5,
                        PosterUrl = "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new MovieManagementAPI.Models.Movie
                    {
                        Title = "Inception",
                        Genre = "Sci-Fi",
                        Rating = 5,
                        PosterUrl = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new MovieManagementAPI.Models.Movie
                    {
                        Title = "Forrest Gump",
                        Genre = "Drama",
                        Rating = 5,
                        PosterUrl = "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new MovieManagementAPI.Models.Movie
                    {
                        Title = "The Matrix",
                        Genre = "Sci-Fi",
                        Rating = 5,
                        PosterUrl = "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new MovieManagementAPI.Models.Movie
                    {
                        Title = "Pulp Fiction",
                        Genre = "Crime",
                        Rating = 5,
                        PosterUrl = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new MovieManagementAPI.Models.Movie
                    {
                        Title = "The Godfather",
                        Genre = "Crime",
                        Rating = 5,
                        PosterUrl = "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new MovieManagementAPI.Models.Movie
                    {
                        Title = "Interstellar",
                        Genre = "Sci-Fi",
                        Rating = 5,
                        PosterUrl = "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new MovieManagementAPI.Models.Movie
                    {
                        Title = "Avengers: Endgame",
                        Genre = "Action",
                        Rating = 4,
                        PosterUrl = "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new MovieManagementAPI.Models.Movie
                    {
                        Title = "Parasite",
                        Genre = "Thriller",
                        Rating = 5,
                        PosterUrl = "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=400",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new MovieManagementAPI.Models.Movie
                    {
                        Title = "Spider-Man: No Way Home",
                        Genre = "Action",
                        Rating = 4,
                        PosterUrl = "https://images.unsplash.com/photo-1626278664285-f796b9ee7806?w=400",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new MovieManagementAPI.Models.Movie
                    {
                        Title = "Joker",
                        Genre = "Thriller",
                        Rating = 5,
                        PosterUrl = "https://images.unsplash.com/photo-1574267432644-f610f1289f0c?w=400",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    }
                };
                
                context.Movies.AddRange(movies);
                await context.SaveChangesAsync();
                logger.LogInformation($"Successfully seeded {movies.Length} movies!");
            }
            else
            {
                logger.LogInformation("Database already contains data. Skipping seed.");
            }
        }
        else
        {
            logger.LogError("Cannot connect to database!");
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while migrating the database. Error: {Message}", ex.Message);
        logger.LogError("Inner exception: {InnerException}", ex.InnerException?.Message);
        // Don't throw - let the app start so we can see logs
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
