using Microsoft.AspNetCore.Identity;

namespace MyDrive.Models;

public class AppUser : IdentityUser
{
    public string DisplayName { get; set; }
}