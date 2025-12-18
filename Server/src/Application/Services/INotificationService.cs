using Domain.Notifications;

namespace Application.Services;

public interface INotificationService
{
    Task SendNotificationToUser(Guid userId, Notification notification);
}
