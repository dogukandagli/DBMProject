using Application.Chat.Conversations.Queries.GetInboxConversations;
using Application.Common;

namespace Application.Chat.Conversations.Interfaces;

public interface IConversationReadService
{
    Task<PagedResult<ConversationInboxDto>> GetInboxAsync(
        Guid myUserId,
        int Page,
        int PageSize,
        CancellationToken ct);
}
