using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace MyDrive.Models;

public class Folder
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
    
    public long Size { get; set; }
    public Guid? ParentFolderId { get; set; }
    [JsonIgnore]
    public Folder? ParentFolder { get; set; }
    public List<Folder> SubFolders { get; set; } = new();
    public List<FileType> Files { get; set; } = new();
}