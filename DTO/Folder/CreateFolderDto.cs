using System.ComponentModel.DataAnnotations;
using MyDrive.Models;

namespace MyDrive.DTO.Folder;

public class CreateFolderDto
{
    public required string Id { get; set; }
    [StringLength(256, MinimumLength = 1)]
    [Required]
    public required string Name { get; set; }

    [Required]
    [StringLength(512, MinimumLength = 1)]
    public required string Path { get; set; }

    [Required]
    public bool IsAccessible { get; set; } = false;
    public Guid ParentFolderId { get; set; }
}