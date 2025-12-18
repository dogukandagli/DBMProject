using Application.Services;
using Application.Users.Commands;
using Application.Users.Interfaces;
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

        app.MapPost("/me/request-my-information",
            async (ISender sender, [FromForm] ExportMyDataCommand request, CancellationToken cancellationToken) =>
            {
                var response = await sender.Send(request, cancellationToken);

                if (!response.IsSuccessful)
                    return Results.BadRequest(response);
                return Results.File(
                    response.Data!.Content,
                    response.Data!.ContentType,
                    response.Data!.FileName
                );
            })
            .RequireAuthorization()
            .DisableAntiforgery();



        app.MapPost("/me/deactivate",
    async (ISender sender, CancellationToken cancellationToken) =>
    {
        var response = await sender.Send(new DeactivateAccountCommand(), cancellationToken);
        return response.IsSuccessful ? Results.Ok(response) : Results.BadRequest(response);
    })
    .Produces<Result<string>>()
    .RequireAuthorization();

        app.MapGet("/me/neighborhood", async (
            IClaimContext claimContext,
            IUserReadService userReadService,
            CancellationToken ct) =>
        {
            var userId = claimContext.GetUserId();
            var userDto = await userReadService.GetUserDtoAsync(userId, ct);

            if (userDto == null)
                return Results.NotFound("Kullanıcı bulunamadı");
            return Results.Ok(Result<object>.Succeed(userDto.Neighborhood));
        })
        .RequireAuthorization();

        app.MapPost("/me/cover-photo",
            async (ISender sender, [FromForm] UpdateCoverPhotoCommand request, CancellationToken cancellationToken) =>
            {
                var response = await sender.Send(request, cancellationToken);
                return response.IsSuccessful ? Results.Ok(response) : Results.InternalServerError(response);
            }).Produces<Result<UpdateCoverPhotoCommandResponse>>()
            .RequireAuthorization()
            .DisableAntiforgery();
        app.MapDelete("/me/cover-photo",
            async (ISender sender, CancellationToken cancellationToken) =>
            {
                var response = await sender.Send(new DeleteCoverPhotoCommand(), cancellationToken);
                return response.IsSuccessful ? Results.Ok(response) : Results.InternalServerError(response);
            }).Produces<Result<string>>()
            .RequireAuthorization()
            ;
        app.MapPatch("/me/updateInfo",
            async (ISender sender, [FromForm] UpdateUserInfoCommand request, CancellationToken cancellationToken) =>
            {
                var response = await sender.Send(request, cancellationToken);
                return response.IsSuccessful ? Results.Ok(response) : Results.InternalServerError(response);
            })
            .Produces<Result<UpdateUserInfoCommandResponse>>()
            .RequireAuthorization()
            .DisableAntiforgery();
    }
}
