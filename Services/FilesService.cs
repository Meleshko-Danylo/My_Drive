using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyDrive.Data;
using MyDrive.DTO.File;
using MyDrive.Models;

namespace MyDrive.Services;

public class FilesService: IFilesService
{
    private readonly AppDbContext _db;
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<FilesService> _logger;

    public FilesService(AppDbContext db, IWebHostEnvironment env, ILogger<FilesService> logger)
    {
        _db = db;
        _env = env;
        _logger = logger;
    }

    public async Task<FileResponseDto> UploadFileAsync(FileUploadDto fileRequest)
    {
        var folderExists = await _db.Folders.FindAsync(fileRequest.FolderId);
        if(folderExists is null)
            throw new Exception("Folder does not exist");
        
        var filesDirectory = Path.Combine(_env.ContentRootPath, "Files");
        if (!Directory.Exists(filesDirectory)) Directory.CreateDirectory(filesDirectory);
        
        var newFileName = Guid.NewGuid() + "_" + fileRequest.File.Name;
        var filePath = Path.Combine(_env.ContentRootPath, "Files", newFileName);
        await using FileStream stream = new FileStream(filePath, FileMode.Create);
        await fileRequest.File.CopyToAsync(stream);

        var uploadedFile = new FileType
        {
            Name = fileRequest.File.FileName,
            Size = fileRequest.File.Length,
            ContentType = fileRequest.File.ContentType,
            Path = folderExists.Path + fileRequest.File.FileName,
            CreatedAt = DateTime.UtcNow,
            StoragePath = filePath,
            FolderId = fileRequest.FolderId,
            IsAccessible = fileRequest.IsAccessible
        };
        await _db.Files.AddAsync(uploadedFile);
        folderExists.Size += uploadedFile.Size;
        await _db.SaveChangesAsync();

        _logger.LogInformation($"File {uploadedFile.Name} was successfully uploaded to the server");
        return MapToResponseDto(uploadedFile);
    }

    public async Task DeleteFileAsync(Guid fileId)
    {
        var file = await _db.Files.FindAsync(fileId);
        if(file is null)
            throw new Exception("File does not exist");

        if (File.Exists(file.StoragePath)) {
            try {
                File.Delete(file.StoragePath);
            }
            catch (Exception e) {
                _logger.LogError(e, "Error deleting file");
            }
        }
        
        var folder = await _db.Folders.FindAsync(file.FolderId);
        if(folder != null) folder.Size -= file.Size;
        
        _db.Files.Remove(file);
        await _db.SaveChangesAsync();
        
        _logger.LogInformation($"File {file.Name} was successfully deleted from the server");
    }
    
    public async Task<List<FileResponseDto>> GetFilesAsync(Guid folderId)
    {
         var files = await _db.Files.Where(f => f.FolderId == folderId).ToListAsync();
         if(files.Count == 0) return new List<FileResponseDto>();
         
         return files.Select(MapToResponseDto).ToList();
    }
    
    public async Task<FileStreamResult> DownloadFileAsync(Guid fileId, ControllerBase contriller)
    {
        var file = await _db.Files.FindAsync(fileId);
        if (file is null)
            throw new FileNotFoundException($"File with '{fileId}' id not found");
        // await using var stream = new FileStream(file.StoragePath, FileMode.Open, FileAccess.Read); 
        var stream = new FileStream(file.StoragePath, FileMode.Open, FileAccess.Read);
        return contriller.File(stream, file.ContentType, file.Name);
    }
    
    public async Task<FileResponseDto> GetFileInfoAsync(Guid fileId)
    {
        var fileInfo = await _db.Files.FindAsync(fileId);
        if (fileInfo is null)
            throw new FileNotFoundException($"File with '{fileId}' id not found");

        return MapToResponseDto(fileInfo);
    }

    public async Task<string> GetContentOfTextFileAsync(Guid fileId)
    {
        var file = await _db.Files.FindAsync(fileId);
        if (file is null || !File.Exists(file.StoragePath))
            throw new FileNotFoundException($"File with '{fileId}' id not found");
        if (!file.ContentType.StartsWith("text"))
            throw new ArgumentException("This file cannot be opened as text");

        // var content = await File.ReadAllTextAsync(file.StoragePath);
        string content;
        using (var reader = new StreamReader(file.StoragePath, Encoding.UTF8)){
            content = await reader.ReadToEndAsync();
        }
        return content;
    } 
    
    public async Task<FileResponseDto> UpdateFileInfoAsync(UpdateFileDto update)
    {
        var file = await _db.Files.FindAsync(update.FileId);
        if (file is null)
            throw new FileNotFoundException($"File with '{update.FileId}' id not found");

        if(!string.IsNullOrEmpty(update.Name)) {
            file.Name = update.Name;
            var pathParts = file.Path.Split('/');
            pathParts[^1] = update.Name;
            file.Path = string.Join('/', pathParts);
        }

        if (update.FolderId.HasValue && update.FolderId.Value != file.FolderId) {
            var oldFolder = await _db.Folders.FindAsync(file.FolderId);
            var newFolder = await _db.Folders.FindAsync(update.FolderId.Value);
            if(oldFolder != null) oldFolder.Size -= file.Size;
            if(newFolder != null) newFolder.Size += file.Size;
            file.FolderId = update.FolderId.Value;
            file.Path = $"{newFolder.Path}{file.Name}";
        }
        
        file.IsAccessible = update.IsAccessible;
        await _db.SaveChangesAsync();
        
        _logger.LogInformation($"File {file.Name} was successfully updated");
        return MapToResponseDto(file);
    }
    
    private static FileResponseDto MapToResponseDto(FileType file){
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
}

public interface IFilesService {
    Task<FileResponseDto> UploadFileAsync(FileUploadDto fileRequest);
    Task DeleteFileAsync(Guid fileId);
    Task<List<FileResponseDto>> GetFilesAsync(Guid folderId);
    Task<FileStreamResult> DownloadFileAsync(Guid fileId, ControllerBase controllerBase);
    Task<FileResponseDto> GetFileInfoAsync(Guid fileId);
    Task<FileResponseDto> UpdateFileInfoAsync(UpdateFileDto update);
    Task<string> GetContentOfTextFileAsync(Guid fileId);
}