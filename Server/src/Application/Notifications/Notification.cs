using Application.Notifications.Enums;
using Domain.Abstractions;

namespace Application.Notifications;

public sealed class Notification : AggregateRoot
{

    public Guid UserId { get; private set; }
    public string Title { get; private set; } = default!;
    public string Message { get; private set; } = default!;
    public bool IsRead { get; private set; } = false;

    public Guid RelatedRelatedEntityId { get; private set; }
    public NotificationType Type { get; private set; }
    public Notification(Guid userId, string title, string message, bool ısRead, Guid relatedRelatedEntityId, NotificationType type)
    {
        UserId = userId;
        Title = title;
        Message = message;
        IsRead = ısRead;
        RelatedRelatedEntityId = relatedRelatedEntityId;
        Type = type;
    }
}
