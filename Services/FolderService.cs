using System.IO.Compression;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyDrive.Data;
using MyDrive.DTO.File;
using MyDrive.DTO.Folder;
using MyDrive.Models;

namespace MyDrive.Services
{
    public interface IFolderService
    {
        Task<FileResult> DownloadFolderAsZip(Guid folderId, ControllerBase controller);
        Task<Folder> GetFullFolder(Guid id);
        Task<List<FileResponseDto>> UploadFolder(UploadFolderDto dto);
    }

    public class FolderService : IFolderService
    {
        private readonly AppDbContext _db;
        private readonly IWebHostEnvironment _env;
        
        public FolderService(AppDbContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }
        
        public async Task<Folder> GetFullFolder(Guid id)
        {
            var folder = await _db.Folders
                .AsNoTracking()
                .Include(f => f.Files)
                .Include(f => f.SubFolders)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (folder == null) return null;
            await LoadSubfoldersRecursively(folder);
            
            return folder;
        }

        public async Task<List<FileResponseDto>> UploadFolder(UploadFolderDto dto)
        {
            var parentFolder = await _db.Folders.FindAsync(Guid.Parse(dto.ParentFolderId));
            if (parentFolder == null) throw new Exception("Parent folder does not exist.");
            
            var filesDirectory = Path.Combine(_env.ContentRootPath, "Files");
            if (!Directory.Exists(filesDirectory)) Directory.CreateDirectory(filesDirectory);
            var uploadedFiles = new List<FileResponseDto>();
            
            try {
                var filesByDirectory = dto.Files
                    .GroupBy(f => Path.GetDirectoryName(f.FileName.Replace("\\", "/")))
                    .ToDictionary(g => g.Key ?? "", g => g.ToList());
                foreach (var directory in filesByDirectory)
                {
                    var relativePath = directory.Key;
                    var directoryPath = $"{parentFolder.Path}{(relativePath.Length > 0 ? relativePath + "/" : "")}";
                    var newFolder = new Folder()
                    {
                        Id = Guid.NewGuid(),
                        Name = relativePath.Split("/").Last(),
                        Path = directoryPath,
                        IsAccessible = dto.IsAccessible,
                        CreatedAt = DateTime.UtcNow,
                        ParentFolderId = Guid.Parse(dto.ParentFolderId)
                    };
                    _db.Folders.Add(newFolder);

                    foreach (var file in directory.Value)
                    {
                        var fileName = Path.GetFileName(file.FileName);
                        var newFileName = Guid.NewGuid().ToString();
                        var filePathInDb = $"{directoryPath}{fileName}";
                        var storagePath = Path.Combine(filesDirectory, newFileName);
                        await using (var stream = new FileStream(storagePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        var uploadedFile = new FileType()
                        {
                            Id = Guid.NewGuid(),
                            Name = fileName,
                            StoragePath = storagePath,
                            CreatedAt = DateTime.UtcNow,
                            FolderId = newFolder.Id,
                            IsAccessible = dto.IsAccessible,
                            Path = filePathInDb,
                            Size = file.Length,
                            ContentType = file.ContentType
                        };
                        await _db.Files.AddAsync(uploadedFile);
                        parentFolder.Size += uploadedFile.Size;
                        uploadedFiles.Add(ModelsMapper.MapToFileResponseDto(uploadedFile));
                    }
                }
                await _db.SaveChangesAsync();
                return uploadedFiles;
            }
            catch (Exception e) {
                Console.WriteLine(e);
                throw;
            }
        }

        private async Task LoadSubfoldersRecursively(Folder folder)
        {
            if (folder == null) return;
            
            var subfolders = await _db.Folders
                .AsNoTracking()
                .Include(f => f.Files)
                .Include(f => f.SubFolders)
                .Where(f => f.ParentFolderId == folder.Id)
                .ToListAsync();
            
            if (subfolders.Count == 0) return;
            
            foreach (var subfolder in subfolders)
            {
                await LoadSubfoldersRecursively(subfolder);
            }
            folder.SubFolders = subfolders;
        }
        
        public async Task<FileResult> DownloadFolderAsZip(Guid folderId, ControllerBase controller)
        {
            var folder = await _db.Folders
                .Include(f => f.Files)
                .Include(f => f.SubFolders)
                    .ThenInclude(sf => sf.Files)
                .Include(f => f.SubFolders)
                    .ThenInclude(sf => sf.SubFolders)
                .FirstOrDefaultAsync(f => f.Id == folderId);
                
            if (folder == null)
            {
                throw new FileNotFoundException($"Folder with ID {folderId} not found");
            }
            
            using var memoryStream = new MemoryStream();
            using (var archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, true))
            {
                var rootFolderName = folder.Name;
                foreach (var file in folder.Files)
                {
                    if (File.Exists(file.StoragePath))
                    {
                        var zipEntryPath = Path.Combine(rootFolderName, file.Name);
                        var zipEntry = archive.CreateEntry(zipEntryPath);
                        using var entryStream = zipEntry.Open();
                        using var fileStream = new FileStream(file.StoragePath, FileMode.Open, FileAccess.Read);
                        await fileStream.CopyToAsync(entryStream);
                    }
                }
                await AddSubfoldersToZip(archive, folderId, rootFolderName);
            }
            // Reset the position to the beginning of the stream
            memoryStream.Position = 0;
            return controller.File(memoryStream.ToArray(), "application/zip", $"{folder.Name}.zip");
        }
        
        private async Task AddSubfoldersToZip(ZipArchive archive, Guid parentFolderId, string currPath)
        {
            var subfolders = await _db.Folders
                .Include(f => f.Files)
                .Where(f => f.ParentFolderId == parentFolderId)
                .ToListAsync();
            
            foreach (var subfolder in subfolders)
            {
                var subfolderPath = Path.Combine(currPath, subfolder.Name);
                archive.CreateEntry(subfolderPath + "/");
                
                foreach (var file in subfolder.Files)
                {
                    if (File.Exists(file.StoragePath))
                    {
                        var zipEntryPath = Path.Combine(subfolderPath, file.Name);
                        var zipEntry = archive.CreateEntry(zipEntryPath);
                        using var entryStream = zipEntry.Open();
                        using var fileStream = new FileStream(file.StoragePath, FileMode.Open, FileAccess.Read);
                        await fileStream.CopyToAsync(entryStream);
                    }
                }
                await AddSubfoldersToZip(archive, subfolder.Id, subfolderPath);
            }
        }
    }
}