using Application.Common;
using Ardalis.Specification;
using Domain.Notifications;

namespace Application.Notifications.Queries.GetUserNotifications;

public sealed class UserNotificationsSpecification : FeedBaseSpecification<Notification, NotificationDto>
{
    public UserNotificationsSpecification(Guid UserId, bool onlyUnread)
    {
        Query
            .Where(n => n.UserId == UserId);

        if (onlyUnread)
        {
            Query.Where(n => n.IsRead == false);
        }

        Query
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => new NotificationDto(
                n.Id,
                n.Title,
                n.Message,
                n.Type.ToString(),
                n.IsRead,
                n.CreatedAt,
                n.RelatedEntityId,
                n.MetaData));
    }
}

