namespace MyDrive.DTO.File;

public class FileUploadDto
{
    public Guid FolderId { get; set; }
    public IFormFile File { get; set; }
}