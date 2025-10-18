using Application.Auth;
using MediatR;
using TS.Result;

namespace WebAPI.Modules;

public static class AuthModule
{
    public static void MapAuth(this IEndpointRouteBuilder builder)
    {
        var app = builder.MapGroup("/auth").WithTags("Auth");

        app.MapPost("/login",
            async (ISender sender, LoginCommand request, CancellationToken cancellationToken) =>
            {
                var response = await sender.Send(request, cancellationToken);
                return response.IsSuccessful ? Results.Ok(response) : Results.InternalServerError(response);
            }).Produces<Result<LoginCommandResponse>>();

        app.MapPost("/confirmEmail",
            async (ISender sender, ConfirmEmailCommand request, CancellationToken cancellationToken) =>
            {
                var response = await sender.Send(request, cancellationToken);
                return response.IsSuccessful ? Results.Ok(response) : Results.InternalServerError(response);
            }).Produces<Result<string>>();
        app.MapPost("/loginWithTFA",
            async (ISender sender, LoginWithTFACommand request, CancellationToken cancellationToken) =>
            {
                var response = await sender.Send(request, cancellationToken);
                return response.IsSuccessful ? Results.Ok(response) : Results.InternalServerError(response);
            }).Produces<Result<LoginCommandResponse>>();
        app.MapPost("/forgotPassword",
            async (ISender sender, ForgotPasswordCommand request, CancellationToken cancellationToken) =>
            {
                var response = await sender.Send(request, cancellationToken);
                return response.IsSuccessful ? Results.Ok(response) : Results.InternalServerError(response);
            }).Produces<Result<string>>();
        app.MapPost("/resetPassword",
            async (ISender sender, ResetPasswordComand request, CancellationToken cancellationToken) =>
            {
                var response = await sender.Send(request, cancellationToken);
                return response.IsSuccessful ? Results.Ok(response) : Results.InternalServerError(response);
            }).Produces<Result<string>>();
        app.MapPost("/register",
            async (ISender sender, RegisterCommand request, CancellationToken cancellationToken) =>
            {
                var response = await sender.Send(request, cancellationToken);
                return response.IsSuccessful ? Results.Ok(response) : Results.InternalServerError(response);
            }).Produces<Result<string>>();
        app.MapGet("/refreshToken",
            async (ISender sender, CancellationToken cancellationToken) =>
            {
                var response = await sender.Send(new RefreshTokenCommand(), cancellationToken);
                return response.IsSuccessful ? Results.Ok(response) : Results.InternalServerError(response);
            }).Produces<Result<LoginCommandResponse>>();
    }
}
