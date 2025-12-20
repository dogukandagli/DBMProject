using Application.BorrowRequests.Queries.DTOs;
using Application.BorrowRequests.Queries.GetBorrowRequests;
using Application.BorrowRequests.Queries.GetMyBorrowRequests;
using Application.Common;
using Application.Events.Commands;
using Application.Events.Queries.GetEvents;
using Application.Events.Queries.GetMyEvents;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TS.Result;

namespace WebAPI.Modules;

public static class EventModule
{
    public static void MapEvent(this IEndpointRouteBuilder builder)
    {

        var app = builder
            .MapGroup("/events")
            .RequireRateLimiting("fixed")
            //.RequireAuthorization()
            .WithTags("Events");

        app.MapPost(string.Empty,
            async ([FromForm] EventCreateCommand request, ISender sender, CancellationToken cancellationToken) =>
            {
                var result = await sender.Send(request, cancellationToken);
                return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
            })
            .Accepts<EventCreateCommand>("multipart/form-data")
            .Produces<Result<string>>()
            .DisableAntiforgery()
            ;
        app.MapDelete(string.Empty,
            async ([FromQuery] Guid EventId, ISender sender, CancellationToken cancellationToken) =>
            {
                var result = await sender.Send(new EventDeleteCommand(EventId), cancellationToken);
                return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
            })
            .Produces<Result<string>>()
            ;
        app.MapPost("/join",
            async ([FromQuery] Guid EventId, ISender sender, CancellationToken cancellationToken) =>
            {
                var result = await sender.Send(new EventJoinCommand(EventId), cancellationToken);
                return result.IsSuccessful ? Results.Ok(result) : Results.BadRequest(result);
            })
            .Produces<Result<string>>();
        app.MapPost("/leave",
            async ([FromQuery] Guid EventId, ISender sender, CancellationToken cancellationToken) =>
            {
                var result = await sender.Send(new EventLeaveCommand(EventId), cancellationToken);
                return result.IsSuccessful ? Results.Ok(result) : Results.BadRequest(result);
            })
            .Produces<Result<string>>()
            ;
        app.MapGet("{Page}/{PageSize}",
            async (int Page, int PageSize,
            ISender sender,
            CancellationToken cancellationToken) =>
            {
                var result = await sender.Send(
                    new GetEventQuery(Page, PageSize),
                    cancellationToken);

                return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
            })
            .Produces<Result<PagedResult<EventDto>>>()
            ;
        app.MapGet("me/{Page}/{PageSize}",
            async (int Page, int PageSize,
            ISender sender,
            CancellationToken cancellationToken) =>
            {
                var result = await sender.Send(
                    new GetMyEventsQuery(Page, PageSize),
                    cancellationToken);

                return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
            })
            .Produces<Result<PagedResult<EventDto>>>()
            ;
    }
}

