using Microsoft.AspNetCore.Identity;
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

app.UseHttpsRedirection();
app.UseCors("Development");

app.UseRouting();
app.UseSession();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();