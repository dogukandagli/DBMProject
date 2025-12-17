using Application.Common;
using Application.Notifications.Queries.GetUserNotifications;
using MediatR;
using TS.Result;

namespace WebAPI.Modules;

public static class NotificationModule
{
    public static void MapNotification(this IEndpointRouteBuilder builder)
    {
        var app = builder
          .MapGroup("/notifications")
          .RequireRateLimiting("fixed")
          .RequireAuthorization()
          .WithTags("Notifications");

        app.MapGet("{Page}/{PageSize}",
            async (int Page, int PageSize, bool OnlyUnread,
            ISender sender,
            CancellationToken cancellationToken) =>
            {
                var result = await sender.Send(
                    new GetUserNotificationsQuery(Page, PageSize, OnlyUnread),
                    cancellationToken);

                return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
            })
        .Produces<Result<PagedResult<NotificationDto>>>();
    }
}
