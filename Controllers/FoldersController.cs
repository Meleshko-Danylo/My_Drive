using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyDrive.Data;
using MyDrive.DTO;
using MyDrive.Models;

namespace MyDrive.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class FoldersController: ControllerBase
{
    private readonly AppDbContext _db;
    private readonly UserManager<AppUser> _userManager;

    public FoldersController(AppDbContext db, UserManager<AppUser> userManager)
    {
        _db = db;
        _userManager = userManager;
    }
    
    [HttpGet]
    public async Task<ActionResult<Folder>> GetRootFolder()
    {
        var root = await _db.Folders.AsNoTracking().FirstOrDefaultAsync(f => f.Name == "Root");
        if (root is null)
            return NotFound();
        
        return Ok(root);
    }
    
    [HttpGet("{path}")]
    public async Task<ActionResult<Folder>> GetFolder(string path)
    {
        var folder = await _db.Folders.AsNoTracking().FirstOrDefaultAsync(f => f.Path == path);
        if (folder is null)
            return NotFound();

        return Ok(folder);
    }
    
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateFolder([FromBody] CreateFolderDto folder)
    {
        if (!ModelState.IsValid) return BadRequest();
        var newFolder = new Folder()
        {
            Name = folder.Name,
            Path = folder.Path,
            ParentFolder = folder.ParentFolder!,
            Size = folder.Size,
            IsAccessible = folder.IsAccessible,
            Files = folder.Files,
            SubFolders = folder.SubFolders,
            CreatedAt = DateTime.UtcNow,
            ParentFolderId = folder.ParentFolder!.Id
        };
        
        await _db.Folders.AddAsync(newFolder);
        await _db.SaveChangesAsync();
        
        return CreatedAtAction(nameof(GetFolder), new {id = newFolder.Id}, newFolder);
    }
}