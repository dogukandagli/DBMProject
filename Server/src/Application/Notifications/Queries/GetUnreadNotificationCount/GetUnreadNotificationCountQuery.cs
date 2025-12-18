using Application.Services;
using Domain.Notifications.Repositories;
using MediatR;
using TS.Result;

namespace Application.Notifications.Queries.GetUnreadNotificationCount;

public sealed record GetUnreadNotificationCountQuery : IRequest<Result<GetUnreadNotificationCountQueryResponse>>;

public sealed record GetUnreadNotificationCountQueryResponse(
    int unReadNotificationsCount);
internal sealed class GetUnreadNotificationCountQueryHandler(
    IClaimContext claimContext,
    INotificationRepository notificationRepository) : IRequestHandler<GetUnreadNotificationCountQuery, Result<GetUnreadNotificationCountQueryResponse>>
{
    public async Task<Result<GetUnreadNotificationCountQueryResponse>> Handle(GetUnreadNotificationCountQuery request, CancellationToken cancellationToken)
    {
        Guid currentUserId = claimContext.GetUserId();

        UnreadNotificationsSpecification unreadNotificationsSpecification = new(currentUserId);
        int unReadNotificationsCount = await notificationRepository
            .CountAsync(unreadNotificationsSpecification, cancellationToken);

        return new GetUnreadNotificationCountQueryResponse(unReadNotificationsCount);
    }
}