using Application.Chat.Conversations.Interfaces;
using Application.Chat.Conversations.Queries.GetInboxConversations;
using Application.Common;
using Domain.Conversations.Enums;
using Domain.Users;
using Infrastructure.Persistence.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.QueryServices;

public sealed class ConservationReadService(
    ApplicationDbContext context,
    UserManager<AppUser> userManager) : IConversationReadService
{
    public async Task<PagedResult<ConversationInboxDto>> GetInboxAsync(Guid myUserId, int Page, int PageSize, CancellationToken cancellationToken)
    {

        var query = from me in context.ConversationParticipant.AsNoTracking()
                    where me.UserId == myUserId
                    join other in context.ConversationParticipant.AsNoTracking()
                       on me.ConversationId equals other.ConversationId
                    where other.UserId != myUserId
                    join conversation in context.Conversation.AsNoTracking()
                        on me.ConversationId equals conversation.Id
                    join otherUser in userManager.Users.AsNoTracking()
                        on other.UserId equals otherUser.Id
                    orderby conversation.LastMessageAt descending
                    select new ConversationInboxDto(
                        conversation.Id,
                        conversation.Type == ConversationType.LoanTransaction
                        ? " Kredi İşlemi"
                        : otherUser.FullName,
                        otherUser.ProfilePhotoUrl,
                        conversation.Type,
                        conversation.LastMessagePreview,
                        conversation.LastMessageAt,
                        conversation.RelatedEntityId,
                        conversation.LastMessageSenderId == myUserId,
                        other.LastReadAt != null && conversation.LastMessageAt != null
                            ? other.LastReadAt >= conversation.LastMessageAt
                            : false,
                        conversation.LastMessageSenderId == myUserId
                            ? true
                            : (me.LastReadAt != null && conversation.LastMessageAt != null
                               ? me.LastReadAt >= conversation.LastMessageAt
                               : false)
                        );

        int totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((Page - 1) * PageSize)
            .Take(PageSize)
            .ToListAsync(cancellationToken);


        return new PagedResult<ConversationInboxDto>(items,
            Page,
            PageSize,
            totalCount,
            (int)Math.Ceiling((double)totalCount / PageSize));
    }
}
