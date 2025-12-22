using Application.Chat.Conversations.Interfaces;
using Application.Common;
using Application.Services;
using MediatR;
using TS.Result;

namespace Application.Chat.Conversations.Queries.GetInboxConversations;

public sealed record GetInboxConversationsQuery(
    int Page,
    int PageSize) : IRequest<Result<PagedResult<ConversationInboxDto>>>;


internal sealed class GetInboxConversationsQueryHandler(
    IConversationReadService conversationReadService,
    IClaimContext claimContext
    ) : IRequestHandler<GetInboxConversationsQuery, Result<PagedResult<ConversationInboxDto>>>
{
    public async Task<Result<PagedResult<ConversationInboxDto>>> Handle(GetInboxConversationsQuery request, CancellationToken cancellationToken)
    {
        Guid currentUserId = claimContext.GetUserId();

        return await conversationReadService.GetInboxAsync(currentUserId, request.Page, request.PageSize, cancellationToken);
    }
}