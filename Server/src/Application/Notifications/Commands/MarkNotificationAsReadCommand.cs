using Application.Services;
using Domain.Notifications;
using Domain.Notifications.Repositories;
using MediatR;
using TS.Result;

namespace Application.Notifications.Commands;

public sealed record MarkNotificationAsReadCommand(
    Guid NotificationId) : IRequest<Result<Unit>>;

internal sealed class MarkNotificationAsReadCommandHandler(
    IClaimContext claimContext,
    INotificationRepository notificationRepository
    ) : IRequestHandler<MarkNotificationAsReadCommand, Result<Unit>>
{
    public async Task<Result<Unit>> Handle(MarkNotificationAsReadCommand request, CancellationToken cancellationToken)
    {
        Guid currentUserId = claimContext.GetUserId();

        Notification? notification = await notificationRepository.GetByIdAsync(request.NotificationId, cancellationToken);

        if (notification is null)
            return Result<Unit>.Failure("Bildirim bulunamadı.");

        notification.MarkAsRead(currentUserId);

        await notificationRepository.SaveChangesAsync();
        return Unit.Value;
    }
}