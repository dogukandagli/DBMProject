using Application.Services;
using Domain.Events;
using Domain.Events.Repositories;
using MediatR;
using TS.Result;

namespace Application.Events.Commands;

public sealed record EventLeaveCommand(Guid EventId) : IRequest<Result<string>>;

internal sealed class EventLeaveCommandHandler(
    IEventRepository eventRepository,
    IClaimContext claimContext
    ) : IRequestHandler<EventLeaveCommand, Result<string>>
{
    public async Task<Result<string>> Handle(EventLeaveCommand request, CancellationToken cancellationToken)
    {
        Guid userId = claimContext.GetUserId();

        int neighborhoodId = claimContext.GetNeighborhoodId();

        EventWithParticipantsSpec eventWithParticipantsSpec = new EventWithParticipantsSpec(request.EventId);

        Event? eventEntity = await eventRepository.FirstOrDefaultAsync(eventWithParticipantsSpec, cancellationToken);

        if(eventEntity is null)
        {
            return Result<string>.Failure("Etkinlik bulunamadı.");
        }

        eventEntity.RemoveParticipant(userId);
        await eventRepository.SaveChangesAsync(cancellationToken);

        return "Etkinlikten başarıyla ayrıldınız.";
        
    }
}