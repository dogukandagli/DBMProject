using Application.Services;
using Domain.Notifications;
using Domain.Notifications.Enums;
using Infrastructure.Persistence.Context;

namespace Infrastructure.Services;

public sealed class NotificationService(
    ApplicationDbContext context) : INotificationService
{
    public async Task SendNotificationAsync(Guid userId,
        string title,
        string message,
        NotificationType type,
        Guid relatedId
        , CancellationToken cancellationToken = default)
    {
        Notification notification = new Notification(
            userId,
            title,
            message,
            false,
            relatedId,
            type);

        context.Notification.Add(notification);
        await context.SaveChangesAsync(cancellationToken);
    }
}
