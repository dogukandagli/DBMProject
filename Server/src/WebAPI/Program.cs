using Application;
using Infrastructure;
using Microsoft.AspNetCore.RateLimiting;
using Scalar.AspNetCore;
using System.Threading.RateLimiting;
using WebAPI;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddCors();
builder.Services.AddOpenApi();
builder.Services.AddControllers();
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

app.MapOpenApi();
app.MapScalarApiReference();

app.UseCors(policy => policy
.AllowAnyHeader()
.AllowCredentials()
.AllowAnyMethod()
.WithOrigins("http://localhost:3000")
.SetIsOriginAllowed(t => true));

app.UseExceptionHandler();
app.MapControllers().RequireRateLimiting("fixed");

ExtensionsMiddleware.CreateFirstUser(app);
app.Run();
