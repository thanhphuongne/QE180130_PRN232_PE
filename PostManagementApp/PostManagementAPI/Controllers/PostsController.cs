using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PostManagementAPI.Data;
using PostManagementAPI.DTOs;
using PostManagementAPI.Models;

namespace PostManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<PostsController> _logger;

        public PostsController(ApplicationDbContext context, ILogger<PostsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/posts?search=keyword&sortBy=name&sortOrder=asc
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostResponseDto>>> GetPosts(
            [FromQuery] string? search = null,
            [FromQuery] string? sortBy = "name",
            [FromQuery] string? sortOrder = "asc")
        {
            try
            {
                var query = _context.Posts.AsQueryable();

                // Search by name
                if (!string.IsNullOrWhiteSpace(search))
                {
                    query = query.Where(p => p.Name.ToLower().Contains(search.ToLower()));
                }

                // Sort
                query = sortBy?.ToLower() switch
                {
                    "name" => sortOrder?.ToLower() == "desc"
                        ? query.OrderByDescending(p => p.Name)
                        : query.OrderBy(p => p.Name),
                    _ => query.OrderBy(p => p.Name)
                };

                var posts = await query.ToListAsync();

                var postDtos = posts.Select(p => new PostResponseDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    ImageUrl = p.ImageUrl,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt
                }).ToList();

                return Ok(postDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting posts");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/posts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PostResponseDto>> GetPost(int id)
        {
            try
            {
                var post = await _context.Posts.FindAsync(id);

                if (post == null)
                {
                    return NotFound(new { message = "Post not found" });
                }

                var postDto = new PostResponseDto
                {
                    Id = post.Id,
                    Name = post.Name,
                    Description = post.Description,
                    ImageUrl = post.ImageUrl,
                    CreatedAt = post.CreatedAt,
                    UpdatedAt = post.UpdatedAt
                };

                return Ok(postDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting post {PostId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/posts
        [HttpPost]
        public async Task<ActionResult<PostResponseDto>> CreatePost(CreatePostDto createPostDto)
        {
            try
            {
                var post = new Post
                {
                    Name = createPostDto.Name,
                    Description = createPostDto.Description,
                    ImageUrl = createPostDto.ImageUrl,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Posts.Add(post);
                await _context.SaveChangesAsync();

                var postDto = new PostResponseDto
                {
                    Id = post.Id,
                    Name = post.Name,
                    Description = post.Description,
                    ImageUrl = post.ImageUrl,
                    CreatedAt = post.CreatedAt,
                    UpdatedAt = post.UpdatedAt
                };

                return CreatedAtAction(nameof(GetPost), new { id = post.Id }, postDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating post");
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/posts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePost(int id, UpdatePostDto updatePostDto)
        {
            try
            {
                var post = await _context.Posts.FindAsync(id);

                if (post == null)
                {
                    return NotFound(new { message = "Post not found" });
                }

                post.Name = updatePostDto.Name;
                post.Description = updatePostDto.Description;
                post.ImageUrl = updatePostDto.ImageUrl;
                post.UpdatedAt = DateTime.UtcNow;

                _context.Entry(post).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                var postDto = new PostResponseDto
                {
                    Id = post.Id,
                    Name = post.Name,
                    Description = post.Description,
                    ImageUrl = post.ImageUrl,
                    CreatedAt = post.CreatedAt,
                    UpdatedAt = post.UpdatedAt
                };

                return Ok(postDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating post {PostId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // DELETE: api/posts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            try
            {
                var post = await _context.Posts.FindAsync(id);

                if (post == null)
                {
                    return NotFound(new { message = "Post not found" });
                }

                _context.Posts.Remove(post);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Post deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting post {PostId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/posts/health
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

        // POST: api/posts/migrate
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
