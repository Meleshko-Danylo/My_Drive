using System.ComponentModel.DataAnnotations;

namespace MyDrive.DTO.Auth;

public class LoginDto
{
    [Required]
    [StringLength(256, MinimumLength = 8)]
    public required string Password { get; set; }
    [Required]
    [EmailAddress]
    public required string Email { get; set; }
}