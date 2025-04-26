using MyDrive.DTO.File;
using MyDrive.DTO.Folder;
using MyDrive.Models;

namespace MyDrive.Services;

public static class ModelsMapper
{
    public static FileResponseDto MapToFileResponseDto(FileType file){
        return new FileResponseDto
        {
            Id = file.Id,
            Name = file.Name,
            Size = file.Size,
            ContentType = file.ContentType,
            Path = file.Path,
            CreatedAt = file.CreatedAt,
            IsAccessible = file.IsAccessible, 
            FolderId = file.FolderId
        };
    }
    
    public static FolderDto MapToFolderResponseDto(Folder folder)
    {
        return new FolderDto()
        {
            Id = folder.Id.ToString(),
            Name = folder.Name,
            Path = folder.Path,
            IsAccessible = folder.IsAccessible,
            CreatedAt = folder.CreatedAt,
            Size = folder.Size,
            ParentFolderId = folder.ParentFolderId?.ToString(),
            SubFolders = folder.SubFolders.Select(MapToFolderResponseDto).ToList(),
            Files = folder.Files.Select(MapToFileResponseDto).ToList()
        };
    }
}