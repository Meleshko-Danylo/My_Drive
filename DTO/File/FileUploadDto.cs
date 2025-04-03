﻿namespace MyDrive.DTO.File;

public class FileUploadDto
{
    public Guid FolderId { get; set; }
    public bool IsAccessible { get; set; } = false;
    public IFormFile File { get; set; }
}