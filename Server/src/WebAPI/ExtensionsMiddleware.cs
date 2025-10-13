using Domain.Users;
using Domain.Users.ValueObjects;
using Microsoft.AspNetCore.Identity;

namespace WebAPI;

public class ExtensionsMiddleware
{
    public static async Task CreateFirstUser(WebApplication app)
    {
        using (var scoped = app.Services.CreateScope())
        {
            var userManager = scoped.ServiceProvider.GetRequiredService<UserManager<AppUser>>();

            if (!userManager.Users.Any(p => p.UserName == "admin"))
            {
                FirstName firstName = new("Dogukan");
                LastName lastName = new("Dagli");
                FullName fullName = new("Dogukan Dagli");

                AppUser user = new()
                {
                    UserName = "admin",
                    Email = "harofaj494@gamegta.com",
                    CreatedAt = DateTimeOffset.Now,
                    FirstName = firstName,
                    LastName = lastName,
                    FullName = fullName
                };
                user.CreatedBy = user.Id;
                userManager.CreateAsync(user, "1234").Wait();
            }
        }
    }
}
