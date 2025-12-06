using Application;
using Application.Services;
using Domain.Users;
using Infrastructure;
using Infrastructure.Context;
using Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.OData;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using System.Threading.RateLimiting;
using WebAPI;
using WebAPI.Controllers;
using WebAPI.Modules;


var builder = WebApplication.CreateBuilder(args);



Console.WriteLine(builder.Environment.EnvironmentName);
Console.WriteLine(builder.Configuration.GetConnectionString("SqlServer"));
builder.Services.AddScoped<INeighborhoodGraphService, Infrastructure.Services.NeighborhoodGraphService>();
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddCors();
builder.Services.AddHttpClient("osm");
builder.Services.AddScoped<IOsmNeighborhoodService, OsmNeighborhoodService>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddOpenApi();
builder.Services
    .AddControllers()
    .AddOData(opt =>
        opt
        .Select()
        .Filter()
        .Count()
        .Expand()
        .OrderBy()
        .SetMaxTop(null)
        .AddRouteComponents("odata", MainODataController.GetEdmModel())
    )
    ;
builder.Services.AddRateLimiter(options =>
options.AddFixedWindowLimiter("fixed", opt =>
{
    opt.PermitLimit = 100;
    opt.Window = TimeSpan.FromMinutes(1);
    opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
    opt.QueueLimit = 100;
})
);

builder.Services.AddExceptionHandler<ExceptionHandler>().AddProblemDetails();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    try
    {
        var services = scope.ServiceProvider;
        var httpContextAccessor = services.GetRequiredService<IHttpContextAccessor>();
        if (httpContextAccessor.HttpContext is null)
        {
            httpContextAccessor.HttpContext = new DefaultHttpContext();
        }

        var roleManager = services.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        var userManager = services.GetRequiredService<UserManager<AppUser>>();
        string[] roles = { "Admin", "User" };

        foreach (var roleName in roles)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new IdentityRole<Guid>(roleName));
            }
        }
        //buraya admin yapmak istediğiniz maili girip kaydolun admin oluyonuz
        var adminEmails = new[]
        {
            "tanerderin2003@hotmail.com"
        };

        foreach (var email in adminEmails)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user is null) continue;

            if (!await userManager.IsInRoleAsync(user, "Admin"))
            {
                await userManager.AddToRoleAsync(user, "Admin");
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine("Role/User seeding sırasında hata: " + ex.Message);
    }
}





app.MapOpenApi();
app.MapScalarApiReference();

app.UseCors(policy => policy
            .AllowAnyHeader()
            .AllowCredentials()
            .AllowAnyMethod()
            .SetIsOriginAllowed(t => true));

app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.UseExceptionHandler();

app.MapControllers().RequireRateLimiting("fixed");

app.MapAuth();
app.MapLocation();
app.MapPost();
app.MapAdmin();


ExtensionsMiddleware.CreateFirstUser(app);

if (app.Environment.IsProduction())
{
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        db.Database.Migrate();
    }
}
app.Run();