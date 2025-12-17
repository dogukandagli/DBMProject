using Application.Common;
using Application.Services;
using Domain.Notifications.Repositories;
using MediatR;
using TS.Result;

namespace Application.Notifications.Queries.GetUserNotifications;

public sealed record GetUserNotificationsQuery(
    int Page,
    int PageSize,
    bool OnlyUnread = false) : IRequest<Result<PagedResult<NotificationDto>>>;

internal sealed class GetUserNotificationsQueryHandler(
    INotificationRepository notificationRepository,
    IClaimContext claimContext) : IRequestHandler<GetUserNotificationsQuery, Result<PagedResult<NotificationDto>>>
{
    public async Task<Result<PagedResult<NotificationDto>>> Handle(GetUserNotificationsQuery request, CancellationToken cancellationToken)
    {
        Guid currentUserId = claimContext.GetUserId();

        UserNotificationsSpecification userNotificationsSpecification = new(currentUserId, request.OnlyUnread);
        int totalCount = await notificationRepository.CountAsync(userNotificationsSpecification, cancellationToken);

        List<NotificationDto> items = await notificationRepository
            .ListAsync(userNotificationsSpecification, cancellationToken);

        userNotificationsSpecification.ApplyPaging(request.Page, request.PageSize);

        return new PagedResult<NotificationDto>(
            items,
            request.Page,
            request.PageSize,
            totalCount,
            (int)Math.Ceiling(totalCount / (double)request.PageSize));
    }
}