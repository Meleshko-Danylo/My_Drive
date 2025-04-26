using System.ComponentModel.DataAnnotations;
using MyDrive.DTO.File;

namespace MyDrive.DTO.Folder;

public class FolderDto
{
    public string Id { get; set; }
    [StringLength(256, MinimumLength = 1)]
    public required string Name { get; set; }
    [StringLength(2048, MinimumLength = 1)]
    public required string Path { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsAccessible { get; set; } = true;
    public long Size { get; set; }
    public string ParentFolderId { get; set; }
    public List<FolderDto> SubFolders { get; set; } = new();
    public List<FileResponseDto> Files { get; set; } = new();
}