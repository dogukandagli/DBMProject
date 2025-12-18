using Domain.Users;
using Infrastructure.Options;
using Infrastructure.Persistence.Context;
using Infrastructure.SignalR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
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

            opt.EnableSensitiveDataLogging();
        });

        services.AddIdentity<AppUser, IdentityRole<Guid>>(opt =>
        {
            opt.Password.RequiredLength = 6;
            opt.Password.RequireNonAlphanumeric = false;
            opt.Password.RequireDigit = false;
            opt.Password.RequireLowercase = true;
            opt.Password.RequireUppercase = true;
            opt.Lockout.MaxFailedAccessAttempts = 5;
            opt.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromSeconds(5);
            opt.SignIn.RequireConfirmedEmail = true;
        })
       .AddEntityFrameworkStores<ApplicationDbContext>()
       .AddDefaultTokenProviders();

        services.Configure<MailSettingOptions>(configuration.GetSection("MailSettings"));
        services.Configure<AppSettingOptions>(configuration.GetSection("AppSettings"));

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
        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }
         ).AddJwtBearer(options =>
         {
             options.Events = new JwtBearerEvents
             {
                 OnMessageReceived = context =>
                 {
                     var accessToken = context.Request.Query["access_token"];
                     var path = context.HttpContext.Request.Path;
                     if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("hubs/notification"))
                     {
                         context.Token = accessToken;
                     }
                     return Task.CompletedTask;
                 }
             };
         });
        services.AddAuthorization();
        services.AddAntiforgery();

        services.AddHttpClient("GoogleMaps", client =>
        {
            client.BaseAddress = new Uri("https://maps.googleapis.com/");
        });

        services.AddHttpContextAccessor();

        services.AddSignalR();


        services.AddSingleton<IUserIdProvider, CustomUserIdProvider>();
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
