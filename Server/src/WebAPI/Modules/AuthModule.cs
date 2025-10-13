using Application.Auth;
using MediatR;
using TS.Result;

namespace WebAPI.Modules;

public static class AuthModule
{
    public static void MapAuth(this IEndpointRouteBuilder builder)
    {
        var app = builder.MapGroup("/auth").WithName("Auth");

        app.MapPost("/login",
            async (ISender sender, LoginCommand request, CancellationToken cancellationToken) =>
            {
                var response = await sender.Send(request, cancellationToken);
                return response.IsSuccessful ? Results.Ok(response) : Results.InternalServerError(response);
            }).Produces<Result<LoginCommandResponse>>();

    }
}
