using Application.Common;
using Application.Events.Interfaces;
using Application.Services;
using Domain.Events;
using Domain.Events.Repositories;
using MediatR;
using TS.Result;

namespace Application.Events.Queries.GetEventParticipants;


public sealed record GetEventParticipantsQuery(Guid EventId, int Page, int PageSize) : IRequest<Result<PagedResult<ParticipantDto>>>;

internal sealed class GetEventParticipantsHandler(
    IClaimContext claimContext,
    IEventRepository eventRepository,
    IEventReadService eventReadService
    ) : IRequestHandler<GetEventParticipantsQuery, Result<PagedResult<ParticipantDto>>>
{
    public async Task<Result<PagedResult<ParticipantDto>>> Handle(GetEventParticipantsQuery request, CancellationToken cancellationToken)
    {
        Guid userId = claimContext.GetUserId();

        Event? eventEntity = await eventRepository.GetByIdAsync(request.EventId, cancellationToken);

        if(eventEntity is null)
        {
            return Result<PagedResult<ParticipantDto>>.Failure("Etkinlik bulunamadı.");
        }
        
        EventParticipantSpecification eventParticipantSpecification = new(request.EventId);

        int totalCount = await eventReadService.GetParticipantCountAsync(request.EventId);

        eventParticipantSpecification.ApplyPaging(request.Page, request.PageSize);

        List<ParticipantDto> participantDtos = await eventReadService.GetEventParticipantsAsync(
            eventParticipantSpecification,
            request.EventId,
            cancellationToken);

        PagedResult<ParticipantDto> result = new(
            participantDtos,
            request.Page,
            request.PageSize,
            totalCount,
            (int)Math.Ceiling(totalCount / (double)request.PageSize)
            );

        return result;
   }
}