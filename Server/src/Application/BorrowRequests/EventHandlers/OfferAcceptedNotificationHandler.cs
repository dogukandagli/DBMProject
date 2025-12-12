using Application.Services;
using Domain.BorrowRequests;
using Domain.BorrowRequests.Events;
using Domain.BorrowRequests.Repositories;
using Domain.Notifications.Enums;
using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Application.BorrowRequests.EventHandlers;

public sealed class OfferAcceptedNotificationHandler(
    INotificationService notificationService,
    UserManager<AppUser> userManager,
    ILogger<OfferAcceptedNotificationHandler> logger,
    IBorrowRequestRepository borrowRequestRepository,) : INotificationHandler<OfferAcceptedDomainEvent>
{
    public async Task Handle(OfferAcceptedDomainEvent notification, CancellationToken cancellationToken)
    {
        AppUser? borrowerUser = await userManager.FindByIdAsync(notification.BorrowerId.ToString());
        if (borrowerUser is null)
        {
            logger.LogError("BorrowerId {Id} bulunamadı.", notification.BorrowerId);
            return;
        }

        BorrowRequest? borrowRequest = await borrowRequestRepository.GetByIdAsync(notification.BorrowRequestId, cancellationToken);
        if (borrowRequest is null)
        {
            logger.LogError("BorrowRequestId {Id} bulunamadı.", notification.BorrowRequestId);
            return;
        }

        string title = "Teklifin Kabul Edildi!";
        string message = $"{borrowerUser.FullName}, {borrowRequest.ItemNeeded.Title} için verdiğin teklifi kabul etti.";

        await notificationService.SendNotificationAsync(
            userId: notification.LenderId,
            title: title,
            message: message,
            type: NotificationType.OfferAccepted,
            relatedId: notification.AcceptedOfferId
            );

        logger.LogInformation("Kullanıcı {LenderId} için teklif kabul bildirimi gönderildi.", notification.LenderId);
    }
}
