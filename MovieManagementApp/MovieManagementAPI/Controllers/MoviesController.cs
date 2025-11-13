using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PostManagementAPI.Data;
using PostManagementAPI.DTOs;
using PostManagementAPI.Models;

namespace PostManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<MoviesController> _logger;

        public MoviesController(ApplicationDbContext context, ILogger<MoviesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/movies?search=keyword&genre=action&sortBy=title&sortOrder=asc
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MovieResponseDto>>> GetMovies(
            [FromQuery] string? search = null,
            [FromQuery] string? genre = null,
            [FromQuery] string? sortBy = "title",
            [FromQuery] string? sortOrder = "asc")
        {
            try
            {
                var query = _context.Movies.AsQueryable();

                // Search by title
                if (!string.IsNullOrWhiteSpace(search))
                {
                    query = query.Where(m => m.Title.ToLower().Contains(search.ToLower()));
                }

                // Filter by genre
                if (!string.IsNullOrWhiteSpace(genre))
                {
                    query = query.Where(m => m.Genre != null && m.Genre.ToLower() == genre.ToLower());
                }

                // Sort
                query = sortBy?.ToLower() switch
                {
                    "title" => sortOrder?.ToLower() == "desc"
                        ? query.OrderByDescending(m => m.Title)
                        : query.OrderBy(m => m.Title),
                    "rating" => sortOrder?.ToLower() == "desc"
                        ? query.OrderByDescending(m => m.Rating).ThenBy(m => m.Title)
                        : query.OrderBy(m => m.Rating).ThenBy(m => m.Title),
                    _ => query.OrderBy(m => m.Title)
                };

                var movies = await query.ToListAsync();

                var movieDtos = movies.Select(m => new MovieResponseDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    Genre = m.Genre,
                    Rating = m.Rating,
                    PosterUrl = m.PosterUrl,
                    CreatedAt = m.CreatedAt,
                    UpdatedAt = m.UpdatedAt
                }).ToList();

                return Ok(movieDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting movies");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/movies/genres
        [HttpGet("genres")]
        public async Task<ActionResult<IEnumerable<string>>> GetGenres()
        {
            try
            {
                var genres = await _context.Movies
                    .Where(m => m.Genre != null && m.Genre != "")
                    .Select(m => m.Genre!)
                    .Distinct()
                    .OrderBy(g => g)
                    .ToListAsync();

                return Ok(genres);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting genres");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/movies/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MovieResponseDto>> GetMovie(int id)
        {
            try
            {
                var movie = await _context.Movies.FindAsync(id);

                if (movie == null)
                {
                    return NotFound(new { message = "Movie not found" });
                }

                var movieDto = new MovieResponseDto
                {
                    Id = movie.Id,
                    Title = movie.Title,
                    Genre = movie.Genre,
                    Rating = movie.Rating,
                    PosterUrl = movie.PosterUrl,
                    CreatedAt = movie.CreatedAt,
                    UpdatedAt = movie.UpdatedAt
                };

                return Ok(movieDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting movie {MovieId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/movies
        [HttpPost]
        public async Task<ActionResult<MovieResponseDto>> CreateMovie(CreateMovieDto createMovieDto)
        {
            try
            {
                var movie = new Movie
                {
                    Title = createMovieDto.Title,
                    Genre = createMovieDto.Genre,
                    Rating = createMovieDto.Rating,
                    PosterUrl = createMovieDto.PosterUrl,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Movies.Add(movie);
                await _context.SaveChangesAsync();

                var movieDto = new MovieResponseDto
                {
                    Id = movie.Id,
                    Title = movie.Title,
                    Genre = movie.Genre,
                    Rating = movie.Rating,
                    PosterUrl = movie.PosterUrl,
                    CreatedAt = movie.CreatedAt,
                    UpdatedAt = movie.UpdatedAt
                };

                return CreatedAtAction(nameof(GetMovie), new { id = movie.Id }, movieDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating movie");
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/movies/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMovie(int id, UpdateMovieDto updateMovieDto)
        {
            try
            {
                var movie = await _context.Movies.FindAsync(id);

                if (movie == null)
                {
                    return NotFound(new { message = "Movie not found" });
                }

                movie.Title = updateMovieDto.Title;
                movie.Genre = updateMovieDto.Genre;
                movie.Rating = updateMovieDto.Rating;
                movie.PosterUrl = updateMovieDto.PosterUrl;
                movie.UpdatedAt = DateTime.UtcNow;

                _context.Entry(movie).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                var movieDto = new MovieResponseDto
                {
                    Id = movie.Id,
                    Title = movie.Title,
                    Genre = movie.Genre,
                    Rating = movie.Rating,
                    PosterUrl = movie.PosterUrl,
                    CreatedAt = movie.CreatedAt,
                    UpdatedAt = movie.UpdatedAt
                };

                return Ok(movieDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating movie {MovieId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // DELETE: api/movies/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMovie(int id)
        {
            try
            {
                var movie = await _context.Movies.FindAsync(id);

                if (movie == null)
                {
                    return NotFound(new { message = "Movie not found" });
                }

                _context.Movies.Remove(movie);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Movie deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting movie {MovieId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/movies/health
        [HttpGet("health")]
        public async Task<ActionResult> HealthCheck()
        {
            try
            {
                var canConnect = await _context.Database.CanConnectAsync();
                var pendingMigrations = await _context.Database.GetPendingMigrationsAsync();
                var appliedMigrations = await _context.Database.GetAppliedMigrationsAsync();
                
                return Ok(new
                {
                    status = "healthy",
                    database = new
                    {
                        canConnect,
                        pendingMigrations = pendingMigrations.ToList(),
                        appliedMigrations = appliedMigrations.ToList(),
                        totalPendingMigrations = pendingMigrations.Count(),
                        totalAppliedMigrations = appliedMigrations.Count()
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Health check failed");
                return StatusCode(500, new
                {
                    status = "unhealthy",
                    error = ex.Message,
                    innerError = ex.InnerException?.Message
                });
            }
        }

        // POST: api/movies/migrate
        [HttpPost("migrate")]
        public async Task<ActionResult> RunMigrations()
        {
            try
            {
                _logger.LogInformation("Manual migration requested...");
                await _context.Database.MigrateAsync();
                
                var appliedMigrations = await _context.Database.GetAppliedMigrationsAsync();
                
                return Ok(new
                {
                    message = "Migrations applied successfully",
                    appliedMigrations = appliedMigrations.ToList()
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Manual migration failed");
                return StatusCode(500, new
                {
                    error = "Migration failed",
                    message = ex.Message,
                    innerError = ex.InnerException?.Message
                });
            }
        }
    }
}
