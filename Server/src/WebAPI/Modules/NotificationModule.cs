using Application.Common;
using Application.Notifications.Commands;
using Application.Notifications.Queries.GetUnreadNotificationCount;
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

        app.MapPost("mark-as-read",
           async (MarkNotificationAsReadCommand request,
            ISender sender,
            CancellationToken cancellationToken) =>
           {
               var result = await sender.Send(
                   request,
                   cancellationToken);

               return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
           })
        .Produces<Result<Unit>>();

        app.MapGet("unread-count",
           async (
            ISender sender,
            CancellationToken cancellationToken) =>
           {
               var result = await sender.Send(
                   new GetUnreadNotificationCountQuery(),
                   cancellationToken);

               return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
           })
        .Produces<Result<GetUnreadNotificationCountQueryResponse>>();
    }
}
