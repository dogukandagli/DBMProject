using Application.Chat.Conversations.Commands;
using Application.Chat.Conversations.Queries.GetConversationDetail;
using Application.Chat.Conversations.Queries.GetInboxConversations;
using Application.Common;
using MediatR;
using TS.Result;

namespace WebAPI.Modules;

public static class ConversationModule
{
    public static void MapConversation(this IEndpointRouteBuilder builder)
    {
        var app = builder
           .MapGroup("/conversation")
           .RequireRateLimiting("fixed")
           .RequireAuthorization()
           .WithTags("Conversations");


        app.MapGet("{Page}/{PageSize}",
            async (int Page, int PageSize,
            ISender sender,
            CancellationToken cancellationToken) =>
            {
                var result = await sender.Send(
                    new GetInboxConversationsQuery(Page, PageSize),
                    cancellationToken);

                return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
            })
        .Produces<Result<PagedResult<ConversationInboxDto>>>();

        app.MapGet("{ConversationId}",
            async (Guid ConversationId, ISender sender, CancellationToken cancellationToken) =>
            {
                var result = await sender.Send(
                    new GetConversationDetailQuery(ConversationId),
                    cancellationToken);

                return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
            })
        .Produces<Result<ConversationDetailDto>>();

        app.MapPost("direct",
            async (CreateDirectConversationCommand request, ISender sender, CancellationToken cancellationToken) =>
            {
                var result = await sender.Send(
                     request, cancellationToken);
                return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
            })
            .Produces<Result<CreateDirectConversationCommandResponse>>();

        app.MapPut("{conversationId}/read",
            async (Guid conversationId, ISender sender, CancellationToken cancellationToken) =>
            {
                var result = await sender.Send(
                     new MarkAsReadCommand(conversationId), cancellationToken);
                return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
            })
            .Produces<Result<Unit>>();
    }

}