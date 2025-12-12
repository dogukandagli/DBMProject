using Application.BorrowRequests.Commands;
using Application.BorrowRequests.Queries.GetBorrowRequests;
using Application.Common;
using Application.Posts.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TS.Result;

namespace WebAPI.Modules;

public static class BorrowRequestModule
{
    public static void MapBorrowRequest(this IEndpointRouteBuilder builder)
    {
        var app = builder
           .MapGroup("/borrowRequests")
           .RequireRateLimiting("fixed")
           .RequireAuthorization()
           .WithTags("BorrowRequests");

        app.MapPost(string.Empty,
            async ([FromForm] CreateBorrowRequestCommand request, ISender sender, CancellationToken cancellationToken) =>
            {
                var result = await sender.Send(request, cancellationToken);
                return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
            })
            .Accepts<PostCreateCommand>("multipart/form-data")
            .Produces<Result<Guid>>()
            .DisableAntiforgery();
        app.MapPost("createOffer",
            async ([FromForm] CreateOfferCommand request, ISender sender, CancellationToken cancellationToken) =>
            {
                var result = await sender.Send(request, cancellationToken);
                return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
            })
            .Accepts<PostCreateCommand>("multipart/form-data")
            .Produces<Result<string>>()
            .DisableAntiforgery();

        app.MapPost("acceptOffer",
            async (AcceptOfferCommand request, ISender sender, CancellationToken cancellationToken) =>
            {
                var result = await sender.Send(request, cancellationToken);
                return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
            })
            .Produces<Result<string>>()
            .DisableAntiforgery();

        app.MapGet(string.Empty,
            async ([AsParameters] GetBorrowRequestsQuery request,
            ISender sender,
            CancellationToken cancellationToken) =>
            {
                var result = await sender.Send(
                    request,
                    cancellationToken);

                return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
            })
        .Produces<Result<PagedResult<BorrowRequestDto>>>();
    }
}
