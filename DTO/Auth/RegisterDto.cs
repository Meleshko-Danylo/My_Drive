using System.ComponentModel.DataAnnotations;

namespace MyDrive.DTO.Auth;

public class RegisterDto
{
    [Required]
    [StringLength(512, MinimumLength = 1)]
    public required string UserName { get; set; }
    [Required]
    [StringLength(256, MinimumLength = 8)]
    public required string Password { get; set; }
    [Required]
    [EmailAddress]
    public required string Email { get; set; }
}