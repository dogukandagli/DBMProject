using Application.Common;
using Application.Posts;
using Application.Posts.Queries.GetUserPosts;
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

        app.MapGet("/user/posts",
        async (
            [FromQuery] Guid? userId,
            [FromQuery] int page,
            [FromQuery] int pageSize,
            ISender sender,
            CancellationToken cancellationToken) =>
        {
            var result = await sender.Send(
                new GetUserPostsQuery(userId, page, pageSize),
                cancellationToken);

            return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
        })
        .Produces<PagedResult<PostDto>>(StatusCodes.Status200OK)
        .Produces<IEnumerable<string>>(StatusCodes.Status400BadRequest);
    }
}
