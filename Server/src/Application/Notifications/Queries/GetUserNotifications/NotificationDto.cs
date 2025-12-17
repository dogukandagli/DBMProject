namespace Application.Notifications.Queries.GetUserNotifications;

public sealed record NotificationDto(
    Guid Id,
    string Title,
    string Message,
    string Type,
    bool IsRead,
    DateTimeOffset CreatedAt,
    Guid? RelatedEntityId,
    string? MetaData);
