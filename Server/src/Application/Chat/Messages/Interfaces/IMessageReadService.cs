using Application.Common;

namespace Application.Chat.Messages.Interfaces;

public interface IMessageReadService
{
    Task<CursorPaginatedResponse<MessageDto>> GetMessagesAsync(
        Guid CurrentUserId,
        Guid ConversationId,
        DateTimeOffset? OtherUserLastReadAt,
        DateTimeOffset? Cursor,
        int PageSize,
        CancellationToken cancellationToken);
}