
using Application.Common;
using Application.Events.Interfaces;
using Application.Events.Queries.GetEvents;
using Application.Services;
using Domain.Events.Repositories;
using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using TS.Result;

namespace Application.Events.Queries.GetMyJoinedEvents;

public sealed record GetMyGoingEventsQuery(
    int Page,
    int PageSize
    ) : IRequest<Result<PagedResult<EventDto>>>;

internal sealed class GetMyGoingEventsQueryHandler(
    IClaimContext claimContext,
    UserManager<AppUser> userManager,
    IEventRepository eventRepository,
    IEventReadService eventReadService
    ) : IRequestHandler<GetMyGoingEventsQuery, Result<PagedResult<EventDto>>>
{
    public async Task<Result<PagedResult<EventDto>>> Handle(GetMyGoingEventsQuery request, CancellationToken cancellationToken)
    {
        Guid userId = claimContext.GetUserId();

        AppUser? appUser = await userManager.FindByIdAsync(userId.ToString());
        if (appUser is null)
            return Result<PagedResult<EventDto>>.Failure("Kullanıcı bulunamadı.");

        int neighborhoodId = claimContext.GetNeighborhoodId();

        EventsByUserGoingSpecification eventsByUserGoingSpecification = new(neighborhoodId, userId);

        int totalCount = await eventRepository.CountAsync(eventsByUserGoingSpecification, cancellationToken);

        eventsByUserGoingSpecification.ApplyPaging(request.Page, request.PageSize);

        List<EventDto> eventDtos = await eventReadService.GetEventsAsync(
            eventsByUserGoingSpecification, 
            userId, 
            cancellationToken);

        PagedResult<EventDto> result = new(
            eventDtos,
            request.Page,
            request.PageSize,
            totalCount,
            (int)Math.Ceiling(totalCount / (double)request.PageSize)
            );

        return result;

    }
}
