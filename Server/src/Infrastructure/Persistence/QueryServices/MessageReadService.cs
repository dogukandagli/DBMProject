using Application.Chat.Messages;
using Application.Chat.Messages.Interfaces;
using Application.Common;
using Domain.Users;
using Infrastructure.Persistence.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.QueryServices;

public sealed class MessageReadService(
     ApplicationDbContext context,
     UserManager<AppUser> userManager) : IMessageReadService
{
    public async Task<CursorPaginatedResponse<MessageDto>> GetMessagesAsync(
        Guid CurrentUserId,
        Guid ConversationId,
        DateTimeOffset? OtherUserLastReadAt,
        DateTimeOffset? Cursor,
        int PageSize,
        CancellationToken cancellationToken)
    {

        var query = from m in context.Message.AsQueryable()
                    join u in userManager.Users.AsQueryable() on m.SenderId equals u.Id
                    where m.ConversationId == ConversationId
                    select new
                    {
                        Message = m,
                        User = u
                    };

        if (Cursor.HasValue)
        {
            query = query.Where(x => x.Message.CreatedAt < Cursor.Value);
        }

        var rawData = await query
            .OrderByDescending(x => x.Message.CreatedAt)
            .Take(PageSize + 1)
            .ToListAsync(cancellationToken);

        var messageDtos = rawData.Select(x =>
        {

            bool isMe = x.Message.SenderId == CurrentUserId;

            bool isRead = false;
            DateTimeOffset? readAt = null;

            if (OtherUserLastReadAt.HasValue && x.Message.CreatedAt <= OtherUserLastReadAt.Value)
            {
                isRead = true;
                readAt = OtherUserLastReadAt.Value;
            }

            return new MessageDto(
                x.Message.Id,
                x.Message.ConversationId,
                x.User.Id,
                x.User.FullName,
                x.User.ProfilePhotoUrl,
                x.Message.Content,
                x.Message.Type.ToString(),
                x.Message.CreatedAt,
                isRead,
                readAt,
                isMe);

        }).ToList();

        bool hasMore = false;
        if (messageDtos.Count > PageSize)
        {
            hasMore = true;
            messageDtos.RemoveAt(messageDtos.Count - 1);
        }
        DateTimeOffset? nextCursor = messageDtos.Count > 0 ? messageDtos.Last().CreatedAt : null;

        messageDtos.Reverse();

        return new CursorPaginatedResponse<MessageDto>
        {
            Items = messageDtos,
            NextCursor = nextCursor,
            HasMore = hasMore
        };
    }
}
