using Domain.Notifications.Enums;

namespace Application.Services;

public interface INotificationService
{
    Task SendNotificationAsync(Guid userId,
        string title,
        string message,
        NotificationType type,
        Guid relatedId,
        CancellationToken cancellationToken = default);
}
