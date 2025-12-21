using Application.Chat.Messages.Commands;
using MediatR;
using TS.Result;

namespace WebAPI.Modules;

public static class MessageModule
{
    public static void MapMessage(this IEndpointRouteBuilder builder)
    {
        var app = builder
           .MapGroup("/message")
           .RequireRateLimiting("fixed")
           .RequireAuthorization()
           .WithTags("Messages");


        app.MapPost(string.Empty,
            async (SendMessageCommand request, ISender sender, CancellationToken cancellationToken) =>
            {
                var result = await sender.Send(request, cancellationToken);
                return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
            })
            .Produces<Result<Unit>>()
            .DisableAntiforgery();
    }

}
