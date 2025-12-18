using Domain.Abstractions;
using Domain.Notifications.Enums;

namespace Domain.Notifications;

public sealed class Notification : AggregateRoot
{
    public Guid UserId { get; private set; }
    public string Title { get; private set; } = default!;
    public string Message { get; private set; } = default!;
    public NotificationType Type { get; private set; }

    public Guid? RelatedEntityId { get; private set; }

    public bool IsRead { get; private set; } = false;
    public DateTimeOffset? ReadAt { get; private set; }
    public string? MetaData { get; private set; }

    private Notification() { }
    public Notification(
        Guid userId,
        string title,
        string message,
        NotificationType type,
        Guid? relatedEntityId = null,
        string? metaData = null)
    {
        UserId = userId;
        Title = title;
        Message = message;
        Type = type;
        RelatedEntityId = relatedEntityId;
        MetaData = metaData;
        IsRead = false;
    }

    public void MarkAsRead(Guid userId)
    {
        if (UserId != userId)
            throw new DomainException("Bu bildirime erişim yetkiniz yok.");

        if (IsRead)
            return;

        IsRead = true;
        ReadAt = DateTimeOffset.UtcNow;
    }
}

