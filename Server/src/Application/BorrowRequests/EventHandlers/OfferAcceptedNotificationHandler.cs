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

public sealed class OfferAcceptedNotificationHandler(
    UserManager<AppUser> userManager,
    ILogger<OfferAcceptedNotificationHandler> logger,
    IBorrowRequestRepository borrowRequestRepository,
    INotificationRepository notificationRepository) : INotificationHandler<OfferAcceptedDomainEvent>
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

        await notificationRepository.AddAsync(new Notification(
            notification.LenderId,
            title,
            message,
            NotificationType.OfferAccepted,
            notification.AcceptedOfferId));

        logger.LogInformation("Kullanıcı {LenderId} için teklif kabul bildirimi gönderildi.", notification.LenderId);
    }
}
