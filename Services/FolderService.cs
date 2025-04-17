using System.IO.Compression;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyDrive.Data;

namespace MyDrive.Services
{
    public interface IFolderService
    {
        Task<FileResult> DownloadFolderAsZip(Guid folderId, ControllerBase controller);
    }

    public class FolderService : IFolderService
    {
        private readonly AppDbContext _db;
        
        public FolderService(AppDbContext db)
        {
            _db = db;
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