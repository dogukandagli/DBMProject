using Application.Common;
using Application.Posts.Commands;
using Application.Posts.Commands.Comments;
using Application.Posts.Commands.Reactions;
using Application.Posts.Queries.Comments.GetComments;
using Application.Posts.Queries.GetFeed;
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

        app.MapPut(string.Empty,
            async ([FromForm] UpdatePostCommand request, ISender sender, CancellationToken cancellationToken) =>
            {
                var result = await sender.Send(request, cancellationToken);
                return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
            })
            .Accepts<UpdatePostCommand>("multipart/form-data")
            .Produces<Result<UpdatePostResponse>>()
            .DisableAntiforgery();

        app.MapGet("/me",
        async (
            [FromQuery] int page,
            [FromQuery] int pageSize,
            ISender sender,
            CancellationToken cancellationToken) =>
        {
            var result = await sender.Send(
                new GetUserPostsQuery(null, page, pageSize),
                cancellationToken);

            return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
        })
        .Produces<Result<PagedResult<UserPostDto>>>();

        app.MapGet("/feed",
        async ([AsParameters] GetFeedQuery request,
            ISender sender,
            CancellationToken cancellationToken) =>
        {
            var result = await sender.Send(
                request,
                cancellationToken);

            return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
        })
        .Produces<Result<PagedResult<UserPostDto>>>();

        app.MapPost("/commenting",
           async (ToggleCommentingCommand request, ISender sender, CancellationToken cancellationToken) =>
           {
               var result = await sender.Send(request, cancellationToken);
               return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
           })
           .Produces<Result<string>>()
           ;
        app.MapDelete(string.Empty,
           async ([FromQuery] Guid PostId, ISender sender, CancellationToken cancellationToken) =>
           {
               var result = await sender.Send(new DeletePostCommand(PostId), cancellationToken);
               return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
           })
           .Produces<Result<string>>()
           ;
        app.MapPost("/reactions",
            async (AddReactionCommand request, ISender sender, CancellationToken cancellationToken) =>
            {
                var result = await sender.Send(request, cancellationToken);
                return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
            })
           .Produces<Result<string>>()
           ;
        app.MapDelete("/reactions",
            async ([FromQuery] Guid PostId, ISender sender, CancellationToken cancellationToken) =>
            {
                var result = await sender.Send(new RemoveReactionCommand(PostId), cancellationToken);
                return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
            })
           .Produces<Result<string>>()
           ;
        app.MapPost("/comments",
            async (AddCommentCommand request, ISender sender, CancellationToken cancellationToken) =>
            {
                var result = await sender.Send(request, cancellationToken);
                return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
            })
           .Produces<Result<string>>()
           ;
        app.MapGet("/comments",
        async ([AsParameters] GetPostCommentsQuery request,
            ISender sender,
            CancellationToken cancellationToken) =>
        {
            var result = await sender.Send(
                request,
                cancellationToken);

            return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
        })
        .Produces<Result<PagedResult<PostCommentDto>>>();
        app.MapDelete("{PostId}/comments/{CommentId}",
            async (Guid PostId, Guid CommentId, ISender sender, CancellationToken cancellationToken) =>
            {
                var result = await sender.Send(new DeleteCommentCommand(PostId, CommentId), cancellationToken);
                return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
            }
            ).Produces<Result<Guid>>()
           ;
        app.MapPut("{PostId}/comments/{CommentId}",
                async (Guid PostId, Guid CommentId, [FromBody] UpdateCommentRequest request, ISender sender, CancellationToken cancellationToken) =>
                {
                    var result = await sender.Send(new UpdateCommentCommand(PostId, CommentId, request.Content), cancellationToken);
                    return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
                }
                ).Produces<Result<Guid>>()
               ;

    }
    public record UpdateCommentRequest(string Content);
}
