using System.ComponentModel.DataAnnotations;
using MyDrive.Models;

namespace MyDrive.DTO.Folder;

public class UpdateFolderDto
{
    public Guid Id { get; set; }

    [StringLength(256, MinimumLength = 1)]
    [Required]
    public required string Name { get; set; }

    [Required]
    [StringLength(512, MinimumLength = 1)]
    public required string Path { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Required]
    public bool IsAccessible { get; set; } = true;

    [Required]
    public long Size { get; set; }
    public Guid ParentFolderId { get; set; }
    public Models.Folder? ParentFolder { get; set; }
    public List<Models.Folder> SubFolders { get; set; } = new();
    public List<FileType> Files { get; set; } = new();
}