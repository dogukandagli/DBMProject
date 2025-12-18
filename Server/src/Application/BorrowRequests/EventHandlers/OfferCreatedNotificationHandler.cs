using Application.Services;
using Domain.BorrowRequests;
using Domain.BorrowRequests.Events;
using Domain.BorrowRequests.Repositories;
using Domain.Notifications;
using Domain.Notifications.Enums;
using Domain.Notifications.Repositories;
using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Application.BorrowRequests.EventHandlers;

public sealed class OfferCreatedNotificationHandler(
    UserManager<AppUser> userManager,
    IBorrowRequestRepository borrowRequestRepository,
    INotificationRepository notificationRepository,
    INotificationService notificationService,
    ILogger<OfferCreatedNotificationHandler> logger) : INotificationHandler<OfferCreatedDomainEvent>
{
    public async Task Handle(OfferCreatedDomainEvent notification, CancellationToken cancellationToken)
    {
        BorrowRequest? borrowRequest = await borrowRequestRepository.GetByIdAsync(notification.BorrowRequestId, cancellationToken);
        AppUser? lenderUser = await userManager.FindByIdAsync(notification.LenderId.ToString());
        if (borrowRequest == null)
        {
            logger.LogError("Bildirim gönderilemedi: BorrowRequest {Id} bulunamadı.", notification.BorrowRequestId);
            return;
        }

        if (lenderUser == null)
        {
            logger.LogError("Bildirim gönderilemedi: Teklif veren kullanıcı {Id} bulunamadı.", notification.LenderId);
            return;
        }
        string title = "İsteğine Yeni Teklif Geldi!";
        string message = $"{lenderUser.FullName}, {borrowRequest.ItemNeeded.Title} için sana bir teklif gönderdi. Detayları incele.";

        Notification notification1 = new(
            notification.BorrowerId,
            title,
            message,
            NotificationType.NewOffer,
            notification.OfferId);
        await notificationRepository.AddAsync(notification1);
        await notificationService.SendNotificationToUser(notification.BorrowerId, notification1);

        logger.LogInformation("Kullanıcı {UserId} için teklif bildirimi başarıyla gönderildi.", notification.BorrowerId);
    }
}
