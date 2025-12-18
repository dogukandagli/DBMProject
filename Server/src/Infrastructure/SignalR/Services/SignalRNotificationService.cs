using Application.Notifications.Queries.GetUserNotifications;
using Application.Services;
using Domain.Notifications;
using Infrastructure.SignalR.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Infrastructure.SignalR.Services;

public sealed class SignalRNotificationService(
    IHubContext<NotificationHub> hubContext) : INotificationService
{
    public async Task SendNotificationToUser(Guid userId, Notification notification)
    {
        NotificationDto notificationDto = new(
            notification.Id,
            notification.Title,
            notification.Message,
            notification.Type.ToString(),
            notification.IsRead,
            notification.CreatedAt,
            notification.RelatedEntityId,
            notification.MetaData);

        await hubContext.Clients.User(userId.ToString()).SendAsync("ReceiveNotification", notificationDto);
    }
}

