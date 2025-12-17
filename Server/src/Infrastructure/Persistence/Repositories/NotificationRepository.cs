using Ardalis.Specification.EntityFrameworkCore;
using Domain.Notifications;
using Domain.Notifications.Repositories;
using Infrastructure.Persistence.Context;

namespace Infrastructure.Persistence.Repositories;

internal class NotificationRepository : RepositoryBase<Notification>, INotificationRepository
{
    public NotificationRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
    }
}
