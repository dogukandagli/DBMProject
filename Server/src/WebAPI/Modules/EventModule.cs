using Application.Events;
using Application.Posts.Commands;
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
            .DisableAntiforgery();
    }
}

