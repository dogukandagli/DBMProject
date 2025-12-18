using Application.Common;
using Ardalis.Specification;
using Domain.Notifications;

namespace Application.Notifications.Queries.GetUnreadNotificationCount;

public sealed class UnreadNotificationsSpecification : FeedBaseSpecification<Notification>
{
    public UnreadNotificationsSpecification(Guid userId)
    {
        Query
            .Where(n => n.UserId == userId
            && !n.IsRead);
    }
}
