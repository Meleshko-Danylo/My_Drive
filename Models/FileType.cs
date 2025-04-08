using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace MyDrive.Models;

public class FileType
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [StringLength(256, MinimumLength = 1)]
    public required string Name { get; set; }

    [Required]
    [StringLength(512, MinimumLength = 1)]
    public required string Path { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Required]
    public bool IsAccessible { get; set; } = false;

    [Required]
    public long Size { get; set; }

    [Required]
    [StringLength(80, MinimumLength = 1)]
    public required string ContentType { get; set; }
    
    [Required]
    [StringLength(512, MinimumLength = 1)]
    public required string StoragePath { get; set; } // Physical storage path reference
    
    [Required]
    public required Guid FolderId { get; set; }
    [JsonIgnore]
    public Folder? Folder { get; set; }
}