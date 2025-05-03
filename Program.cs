using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using MyDrive.Data;
using MyDrive.Extentions;
using MyDrive.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddExtendedServices(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

await using (var scope = app.Services.CreateAsyncScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();

    var dbCreator = dbContext.Database.GetService<IDatabaseCreator>() as IRelationalDatabaseCreator;

    if (dbCreator != null && !dbCreator.CanConnect()) await dbContext.Database.MigrateAsync();
    if (dbCreator != null && !dbCreator.HasTables()) await dbContext.Database.MigrateAsync();

    await Seeding.SeedAsync(dbContext, userManager, roleManager, builder.Configuration);
}

app.Map("/api/account/login/google", async ([FromQuery] string returnUrl, HttpContext context) =>
{
    var properties = new AuthenticationProperties
    {
        RedirectUri = "/api/account/login/google/callback",
        Items =
        {
            {"returnUrl", returnUrl}
        }
    };
    await context.ChallengeAsync(GoogleDefaults.AuthenticationScheme, properties);
});

app.Map("/api/account/login/google/callback", async (HttpContext context, UserManager<AppUser> userManager, 
    SignInManager<AppUser> signInManager) =>
{
    var result = await context.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);
    if (!result.Succeeded) {
        context.Response.Redirect("https://localhost:3000/");
        return Results.BadRequest();
    }

    var claimsPrincipal = result.Principal;
    var email = claimsPrincipal.FindFirstValue(ClaimTypes.Email);

    if (string.IsNullOrEmpty(email))
    {
        context.Response.Redirect("https://localhost:3000/");
        return Results.BadRequest();
    }

    var user = await userManager.FindByEmailAsync(email);
    if (user == null)
    {
        user = new AppUser
        {
            UserName = email,
            Email = email,
            EmailConfirmed = true
        };
        var resultCreate = await userManager.CreateAsync(user);
        if (!resultCreate.Succeeded)
        {
            context.Response.Redirect("/");
            return Results.BadRequest(resultCreate.Errors.Select(x => x.Description));
        }
        await userManager.AddToRoleAsync(user, "User");
    }
    await signInManager.SignInAsync(user, true);
    
    var returnUrl = result.Properties.Items["returnUrl"] ?? "https://localhost:3000/";
    context.Response.Redirect(returnUrl);
    return Results.Ok();
});

app.UseHttpsRedirection();
app.UseCors("Development");

app.UseRouting();
app.UseSession();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();