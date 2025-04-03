using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyDrive.Data;
using MyDrive.DTO.Folder;
using MyDrive.Models;

namespace MyDrive.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class FoldersController: ControllerBase
{
    private readonly AppDbContext _db;

    public FoldersController(AppDbContext db)
    {
        _db = db;
    }
    
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Folder>> GetRootFolder()
    {
        var root = await _db.Folders
            .AsNoTracking()
            .FirstOrDefaultAsync(f => f.Path == "/");
        if (root is null)
            return NotFound();
        
        var subfolders = await _db.Folders
            .AsNoTracking()
            .Where(f => f.ParentFolderId==root.Id)
            .ToListAsync();
        
        var files = await _db.Files
            .AsNoTracking()
            .Where(f => f.FolderId==root.Id)
            .ToListAsync();
        
        root.SubFolders = subfolders;
        root.Files = files;
        
        return Ok(root);
    }
    
    [HttpGet]
    public async Task<ActionResult<Folder>> GetFolder(string path)
    {
        var folder = await _db.Folders
            .AsNoTracking()
            .FirstOrDefaultAsync(f => f.Path == path);
        if (folder is null)
            return NotFound();
        
        var subfolders = await _db.Folders
            .AsNoTracking()
            .Where(f => f.ParentFolderId==folder.Id)
            .ToListAsync();
        
        var files = await _db.Files
            .AsNoTracking()
            .Where(f => f.FolderId==folder.Id)
            .ToListAsync();
        
        folder.SubFolders = subfolders;
        folder.Files = files;

        return Ok(folder);
    }
    
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateFolder(CreateFolderDto folder)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        
        var newFolder = new Folder()
        {
            Id = Guid.NewGuid(),
            Name = folder.Name,
            Path = folder.Path,
            IsAccessible = folder.IsAccessible,
            CreatedAt = DateTime.UtcNow,
            ParentFolderId = folder.ParentFolderId
        };
        
        await _db.Folders.AddAsync(newFolder);
        await _db.SaveChangesAsync();
        
        return CreatedAtAction(nameof(GetFolder), new {path = newFolder.Path}, newFolder);
    }
    
    [HttpPut]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateFolder([FromBody] UpdateFolderDto folder)
    {
        if (!ModelState.IsValid) return BadRequest();
        var existingFolder = await _db.Folders.FirstOrDefaultAsync(f => f.Id == folder.Id);
        if (existingFolder is null) return NotFound();
        var updatedFolder = new Folder()
        {
            Id = folder.Id,
            Name = folder.Name,
            Path = folder.Path,
            Size = folder.Size,
            IsAccessible = folder.IsAccessible,
            Files = folder.Files,
            SubFolders = folder.SubFolders,
        };
        _db.Folders.Update(updatedFolder);
        await _db.SaveChangesAsync();
        
        return Ok();
    }
    
    [HttpDelete("{folderId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteFolder(Guid folderId)
    {
        var folderToDelete = await _db.Folders.FindAsync(folderId);
        if (folderToDelete is null) return NotFound();
        _db.Remove(folderToDelete);
        await _db.SaveChangesAsync();

        return Ok();
    }
}