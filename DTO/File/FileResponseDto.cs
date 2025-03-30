namespace MyDrive.DTO.File;

public class FileResponseDto
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Path { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsAccessible { get; set; } = false;
    public long Size { get; set; }
    public required string ContentType { get; set; }
    public required Guid FolderId { get; set; }
}