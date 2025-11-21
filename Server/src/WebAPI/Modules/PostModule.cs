using Application.Posts;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TS.Result;

namespace WebAPI.Modules;

public static class PostModule
{
    public static void MapPost(this IEndpointRouteBuilder builder)
    {
        var app = builder
            .MapGroup("/posts")
            .RequireRateLimiting("fixed")
            .RequireAuthorization()
            .WithTags("Posts");

        app.MapPost(string.Empty,
            async ([FromForm] PostCreateCommand request, ISender sender, CancellationToken cancellationToken) =>
            {
                var result = await sender.Send(request, cancellationToken);
                return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
            })
            .Accepts<PostCreateCommand>("multipart/form-data")
            .Produces<Result<string>>()
            .DisableAntiforgery();
    }
}
