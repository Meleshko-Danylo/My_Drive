using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MyDrive.Data;
using MyDrive.DTO.Auth;
using MyDrive.Models;

namespace MyDrive.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class AuthController: ControllerBase
{
    private readonly AppDbContext _db;
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;

    public AuthController(
        AppDbContext db,
        UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager)
    {
        _db = db;
        _userManager = userManager;
        _signInManager = signInManager;
    }

    [HttpPost]
    public async Task<IActionResult> Register(RegisterDto form)
    {
        var existingUser = await _userManager.FindByEmailAsync(form.Email);
        if (existingUser != null)
        {
            return BadRequest(new { error = "Email already registered" });
        }
        
        var user = new AppUser()
        {
            UserName = form.UserName,
            Email = form.Email,
        };

        var result = await _userManager.CreateAsync(user, form.Password);
        if (!result.Succeeded)
        {
            return BadRequest(new { errors = result.Errors.Select(e => e.Description) });
        }

        await _userManager.AddToRoleAsync(user, "User");
        await _signInManager.SignInAsync(user, isPersistent: true);
        
        return Ok(new {
            userName = user.UserName,
            email = user.Email,
            message = "Registration successful"
        });
    }

    [HttpPost]
    public async Task<IActionResult> Login(LoginDto form)
    {
        var user = await _userManager.FindByEmailAsync(form.Email);
        if (user == null)
        {
            return Unauthorized(new { error = "Invalid email or password" });
        }
        var result = await _signInManager.PasswordSignInAsync(
            user,
            form.Password,
            isPersistent: true,
            lockoutOnFailure: true);

        if (!result.Succeeded)
        {
            if (result.IsLockedOut)
            {
                return StatusCode(423, new { error = "Account is locked out. Try again later." });
            }
            return Unauthorized(new { error = "Invalid email or password" });
        }
        var roles = await _userManager.GetRolesAsync(user);

        return Ok(new {
            userName = user.UserName,
            email = user.Email,
            role = roles[0],
        });
    }

    [HttpGet]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        HttpContext.Session.Clear();
        
        return Ok(new { message = "Logged out successfully" });
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized(new { error = "User not found" });
        }
        var roles = await _userManager.GetRolesAsync(user);
        
        return Ok(new {
            userName = user.UserName,
            email = user.Email,
            role = roles[0]
        });
    }
}