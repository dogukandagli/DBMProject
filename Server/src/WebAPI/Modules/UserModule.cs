using Application.Users.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TS.Result;

namespace WebAPI.Modules;

public static class UserModule
{
    public static void MapUser(this IEndpointRouteBuilder builder)
    {
        var app = builder
            .MapGroup("/users")
            .RequireRateLimiting("fixed")
            .RequireAuthorization()
            .WithTags("Users");

        app.MapPost("/me/profile-photo",
            async (ISender sender, [FromForm] UpdateProfilePhotoCommand request, CancellationToken cancellationToken) =>
            {
                var response = await sender.Send(request, cancellationToken);
                return response.IsSuccessful ? Results.Ok(response) : Results.InternalServerError(response);
            }).Produces<Result<UpdateProfilePhotoCommandResponse>>()
            .RequireAuthorization()
            .DisableAntiforgery();

        app.MapDelete("/me/profile-photo",
             async (ISender sender, CancellationToken cancellationToken) =>
             {
                 var response = await sender.Send(new DeleteProfilePhotoCommand(), cancellationToken);
                 return response.IsSuccessful ? Results.Ok(response) : Results.InternalServerError(response);
             }).Produces<Result<string>>()
            .RequireAuthorization()
            ;

        app.MapPost("/me/cover-photo",
            async (ISender sender, [FromForm] UpdateCoverPhotoCommand request, CancellationToken cancellationToken) =>
            {
                var response = await sender.Send(request, cancellationToken);
                return response.IsSuccessful ? Results.Ok(response) : Results.InternalServerError(response);
            }).Produces<Result<UpdateCoverPhotoCommandResponse>>()
            .RequireAuthorization()
            .DisableAntiforgery();
    }
}
