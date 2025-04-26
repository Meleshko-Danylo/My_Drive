using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyDrive.Data;
using MyDrive.DTO.Folder;
using MyDrive.Models;
using MyDrive.Services;

namespace MyDrive.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class FoldersController: ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IFolderService _folderService;
    private readonly ILogger<FoldersController> _logger;

    public FoldersController(AppDbContext db, IFolderService folderService)
    {
        _db = db;
        _folderService = folderService;
    }
    
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Folder>> GetRootFolder()
    {
        var root = await _db.Folders
            .AsNoTracking()
            .Include(f=>f.SubFolders)
            .Include(f=>f.Files)
            .FirstOrDefaultAsync(f => f.Path == "/");
        if (root is null)
            return NotFound();
        
        return Ok(root);
    }
    
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<Folder>> GetFolder(string path)
    {
        var folder = await _db.Folders
            .AsNoTracking()
            .Include(f=>f.SubFolders)
            .Include(f=>f.Files)
            .FirstOrDefaultAsync(f => f.Path == path);
        if (folder is null)
            return NotFound();

        return Ok(folder);
    }
    
    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<Folder>> GetPublicFolderById(string id)
    {
        var folder = await _db.Folders
            .AsNoTracking()
            .Include(f => f.SubFolders)
            .Include(f => f.Files)
            .FirstOrDefaultAsync(f => f.Id == Guid.Parse(id));
        if(folder is null)
            return NotFound();
        if (!folder.IsAccessible)
            return Forbid();

        return Ok(folder);
    }
    
    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<Folder>> NavigateInsidePublicFolder(string id)
    {
        var folder = await _db.Folders
            .AsNoTracking()
            .Include(f => f.SubFolders)
            .Include(f => f.Files)
            .FirstOrDefaultAsync(f => f.Id == Guid.Parse(id));
        if(folder is null)
            return NotFound();

        return Ok(folder);
    }
    
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateFolder(CreateFolderDto folder)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        
        var newFolder = new Folder()
        {
            Id = Guid.Parse(folder.Id),
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
    
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UploadFolder([FromForm] UploadFolderDto folder)
    {
        // if (!ModelState.IsValid) return BadRequest(ModelState);
        try {
            var uploadedFolder = await _folderService.UploadFolder(folder);
            return Ok(uploadedFolder);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return BadRequest(e.Message);
        }
    }
    
    [HttpPut]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateFolder([FromBody] UpdateFolderDto folder)
    {
        if (!ModelState.IsValid) return BadRequest();
        var existingFolder = await _db.Folders.FirstOrDefaultAsync(f => f.Id == folder.Id);
        if (existingFolder is null) return NotFound();
        
        existingFolder.Name = folder.Name;
        existingFolder.Path = folder.Path;
        existingFolder.IsAccessible = folder.IsAccessible;
        
        _db.Folders.Update(existingFolder);
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
    
    [HttpGet("{folderId:guid}")]
    [Authorize]
    public async Task<IActionResult> DownloadFolder(Guid folderId)
    {
        try
        {
            return await _folderService.DownloadFolderAsZip(folderId, this);
        }
        catch (FileNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}