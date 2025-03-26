using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MyDrive.Data;
using MyDrive.Models;

namespace MyDrive.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class FilesController: ControllerBase
{
    private readonly AppDbContext _db;
    private readonly UserManager<AppUser> _userManager;

    public FilesController(AppDbContext db, UserManager<AppUser> userManager)
    {
        _db = db;
        _userManager = userManager;
    }
}