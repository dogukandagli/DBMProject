using Domain.Users;
using Microsoft.AspNetCore.Identity;

namespace WebAPI;

public class ExtensionsMiddleware
{
    public static void CreateFirstUser(WebApplication app)
    {
        using (var scoped = app.Services.CreateScope())
        {
            var userManager = scoped.ServiceProvider.GetRequiredService<UserManager<AppUser>>();

            if (!userManager.Users.Any(p => p.UserName == "admin2"))
            {

            }
        }
    }
}
