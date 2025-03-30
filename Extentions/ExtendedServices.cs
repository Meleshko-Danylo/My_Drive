using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MyDrive.Data;
using MyDrive.Models;
using MyDrive.Services;

namespace MyDrive.Extentions;

public static class ExtendedServices
{
    public static IServiceCollection AddExtendedServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IFilesService, FilesService>();
        services.AddDbContext<AppDbContext>(opt =>
            opt.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
        
        services.AddIdentity<AppUser, IdentityRole>(opt =>
        {
            opt.Password.RequiredLength = 8;
            opt.Password.RequireNonAlphanumeric = false;
            opt.Password.RequireUppercase = false;
            opt.Password.RequireLowercase = false;
            opt.Password.RequireDigit = true;
            
            opt.User.RequireUniqueEmail = true;
            opt.SignIn.RequireConfirmedAccount = false;
            
            opt.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(20);
            opt.Lockout.MaxFailedAccessAttempts = 5;
        })
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<AppDbContext>()
            .AddDefaultTokenProviders()
            .AddSignInManager();
        
        services.AddDistributedSqlServerCache(options => {
            options.ConnectionString = configuration.GetConnectionString("DefaultConnection");
            options.SchemaName = "dbo";
            options.TableName = "Sessions";
        });
        
        services.AddSession(opt =>
        {
            opt.IdleTimeout = TimeSpan.FromMinutes(20);
            opt.Cookie.HttpOnly = true;
            opt.Cookie.IsEssential = true;
            opt.Cookie.Name = "MyDrive.Session";
            opt.Cookie.SameSite = SameSiteMode.Strict;
            opt.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        });
        
        services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(opt =>
            {
                opt.Cookie.Name = "MyDrive.Auth";
                opt.ExpireTimeSpan = TimeSpan.FromDays(14);
            });

        services.AddCors(policy =>
        {
            policy.AddPolicy("Development", opt =>
            {
                opt.WithOrigins("https://localhost:3000");
                opt.AllowAnyMethod();
                opt.AllowAnyHeader();
                opt.AllowCredentials();
            });
        });
        
        return services;
    }
}