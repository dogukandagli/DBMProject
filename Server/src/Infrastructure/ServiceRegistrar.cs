using Domain.Users;
using GenericRepository;
using Infrastructure.Context;
using Infrastructure.Options;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Scrutor;
using System.Net;
using System.Net.Mail;

namespace Infrastructure;

public static class ServiceRegistrar
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(opt =>
        {
            string connectionString = configuration.GetConnectionString("SqlServer")!;
            opt.UseSqlServer(connectionString);
        });

        services.AddScoped<IUnitOfWork>(srv => srv.GetRequiredService<ApplicationDbContext>());

        services.AddIdentity<AppUser, IdentityRole<Guid>>(opt =>
        {
            opt.Password.RequiredLength = 4;
            opt.Password.RequireNonAlphanumeric = false;
            opt.Password.RequireDigit = false;
            opt.Password.RequireLowercase = false;
            opt.Password.RequireUppercase = false;
            opt.Lockout.MaxFailedAccessAttempts = 5;
            opt.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromSeconds(5);
            opt.SignIn.RequireConfirmedEmail = true;
        })
       .AddEntityFrameworkStores<ApplicationDbContext>()
       .AddDefaultTokenProviders();

        services.Configure<MailSettingOptions>(configuration.GetSection("MailSettings"));
        using var scoped = services.BuildServiceProvider().CreateScope();
        var mailSettings = scoped.ServiceProvider.GetRequiredService<IOptions<MailSettingOptions>>();

        services.AddFluentEmail(mailSettings.Value.User, "MyApp")
            .AddSmtpSender(() => new SmtpClient(mailSettings.Value.Host)
            {
                Port = mailSettings.Value.Port,
                Credentials = new NetworkCredential(mailSettings.Value.User, mailSettings.Value.Password),
                EnableSsl = true

            });

        services.Configure<JwtOptions>(configuration.GetSection("Jwt"));
        services.ConfigureOptions<JwtOptionsSetup>();

        services.Scan(action => action
         .FromAssemblies(typeof(ServiceRegistrar).Assembly)
         .AddClasses(publicOnly: false)
         .UsingRegistrationStrategy(RegistrationStrategy.Skip)
         .AsImplementedInterfaces()
         .WithScopedLifetime()
         );

        return services;
    }
}
