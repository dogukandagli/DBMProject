using Application.Services;
using Domain.BorrowRequests;
using Domain.BorrowRequests.Events;
using Domain.BorrowRequests.Repositories;
using Domain.Notifications.Enums;
using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.BorrowRequests.EventHandlers;

public sealed class BorrowRequestCreatedNotificationHandler(
    INotificationService notificationService,
    IBorrowRequestRepository borrowRequestRepository,
    UserManager<AppUser> userManager,
    ILogger<BorrowRequestCreatedNotificationHandler> logger) : INotificationHandler<BorrowRequestCreatedEvent>
{
    public async Task Handle(BorrowRequestCreatedEvent notification, CancellationToken cancellationToken)
    {
        BorrowRequest? borrowRequest = await borrowRequestRepository.GetByIdAsync(notification.BorrowRequestId, cancellationToken);
        if (borrowRequest is null)
        {
            logger.LogError("BorrowRequestId {Id} bulunamadı.", notification.BorrowRequestId);
            return;
        }
        AppUser? borrowerUser = await userManager.FindByIdAsync(notification.BorrowerId.ToString());
        if (borrowerUser is null)
        {
            logger.LogError("BorrowerId {Id} bulunamadı.", notification.BorrowerId);
            return;
        }

        var targetUserIds = await userManager.Users
            .Where(u => u.NeighborhoodId == borrowerUser.NeighborhoodId
            && u.Id != borrowerUser.Id)
            .Select(u => u.Id)
            .ToListAsync();
        if (targetUserIds.Count == 0)
        {
            logger.LogInformation("Mahallede bildirim gidecek başka kimse yok.");
            return;
        }

        string title = $"Mahallende Yeni Bir İstek Var!";
        string message = $"{borrowerUser.FullName}, {borrowRequest.ItemNeeded.Title} arıyor. Yardımcı olabilir misin?";

        var notificatioinTasks = targetUserIds.Select(userId =>
                notificationService.SendNotificationAsync(
                userId: userId,
                title: title,
                message: message,
                type: NotificationType.NewRequestInNeighborhood,
                relatedId: borrowRequest.Id)
        );

        await Task.WhenAll(notificatioinTasks);

        logger.LogInformation("{Count} kişiye yeni istek bildirimi gönderildi.", targetUserIds.Count);
    }
}
