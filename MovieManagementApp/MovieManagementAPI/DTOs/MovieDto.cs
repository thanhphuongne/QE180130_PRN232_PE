using System.ComponentModel.DataAnnotations;

namespace MovieManagementAPI.DTOs
{
    public class CreateMovieDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(100)]
        public string? Genre { get; set; }

        [Range(1, 5)]
        public int? Rating { get; set; }

        [StringLength(500)]
        public string? PosterUrl { get; set; }
    }

    public class UpdateMovieDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(100)]
        public string? Genre { get; set; }

        [Range(1, 5)]
        public int? Rating { get; set; }

        [StringLength(500)]
        public string? PosterUrl { get; set; }
    }

    public class MovieResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Genre { get; set; }
        public int? Rating { get; set; }
        public string? PosterUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
