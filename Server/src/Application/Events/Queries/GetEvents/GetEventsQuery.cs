using Application.Common;
using Application.Events.Interfaces;
using Application.Services;
using Domain.Events.Repositories;
using MediatR;
using TS.Result;

namespace Application.Events.Queries.GetEvents;

public sealed record GetEventQuery(
    int Page,
    int PageSize
    ) : IRequest<Result<PagedResult<EventDto>>>;

internal sealed class GetEventQueryHandler(
    IClaimContext claimContext,
    IEventRepository eventRepository,
    IEventReadService eventReadService
    ) : IRequestHandler<GetEventQuery, Result<PagedResult<EventDto>>>
{
    public async Task<Result<PagedResult<EventDto>>> Handle(GetEventQuery request, CancellationToken cancellationToken)
    {
        Guid userId = claimContext.GetUserId();
        int neighborhoodId = claimContext.GetNeighborhoodId();

        EventByNeighborhoodSpecification eventByNeighborhoodSpecification = new(neighborhoodId);

        int totalCount = await eventRepository.CountAsync(eventByNeighborhoodSpecification, cancellationToken);

        eventByNeighborhoodSpecification.ApplyPaging(request.Page, request.PageSize);

        List<EventDto> eventDtos = await eventReadService.GetEventsAsync(
            eventByNeighborhoodSpecification, 
            userId, 
            cancellationToken
        );

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