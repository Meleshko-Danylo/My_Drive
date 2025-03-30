namespace MyDrive.DTO.File;

public class UpdateFileDto
{
    public required Guid FileId { get; set; }
    public string? Name { get; set; } = null;
    public bool IsAccessible { get; set; } = false;
    public Guid? FolderId { get; set; } = null;
}