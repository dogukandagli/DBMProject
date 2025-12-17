using Domain.Notifications;

namespace Application.Services;

public interface IRealTimeService
{
    Task SendNotificationToUser(Guid userId, Notification notification);
}
