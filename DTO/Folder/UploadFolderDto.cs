namespace MyDrive.DTO.Folder;

public class UploadFolderDto
{
    public bool IsAccessible { get; set; }
    public List<IFormFile> Files { get; set; } = new();
    public required string ParentFolderId { get; set; }
}