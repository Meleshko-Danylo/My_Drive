using System.ComponentModel.DataAnnotations;
using MyDrive.Models;

namespace MyDrive.DTO.Folder;

public class UpdateFolderDto
{
    public Guid Id { get; set; }
    [StringLength(256, MinimumLength = 1)]
    public string Name { get; set; }
    [StringLength(512, MinimumLength = 1)]
    public string Path { get; set; }
    public bool IsAccessible { get; set; } = true;
}