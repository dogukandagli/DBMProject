using Application.Services;
using Domain.Events;
using Domain.Events.Repositories;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TS.Result;

namespace Application.Events.Commands;

public sealed record EventJoinCommand(Guid EventId) : IRequest<Result<string>>;

internal sealed class EventJoinCommandHandler(
    IEventRepository eventRepository,
    IClaimContext claimContext
    ) : IRequestHandler<EventJoinCommand, Result<string>>
{
    public async Task<Result<string>> Handle(EventJoinCommand request, CancellationToken cancellationToken)
    {
        Guid userId = claimContext.GetUserId();

        int neighborhoodId = claimContext.GetNeighborhoodId();

        EventWithParticipantsSpec eventWithParticipantsSpec = new EventWithParticipantsSpec(request.EventId);

        Event? eventEntity = await eventRepository.FirstOrDefaultAsync(eventWithParticipantsSpec, cancellationToken);

        if (eventEntity is null) 
        {
            return Result<string>.Failure("Var olmayan etkinliğe katılamazsınız.");
        }

        if(eventEntity.NeighborhoodId != neighborhoodId)
        {
            return Result<string>.Failure("Sadece kendi mahallenizdeki etkinliğe katılabilirsiniz.");
        }

        eventEntity.AddParticipant(userId);
        await eventRepository.SaveChangesAsync(cancellationToken);

        return "Katılım başarılı.";
    }
}
