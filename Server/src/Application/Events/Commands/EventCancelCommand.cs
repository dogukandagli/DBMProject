using Application.Services;
using Domain.Events;
using Domain.Events.Repositories;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TS.Result;

namespace Application.Events.Commands;

public sealed record EventCancelCommand(
    Guid EventId
    ) : IRequest<Result<string>>;

internal sealed class EventCancelCommandHandler(
    IClaimContext claimContext,
    IEventRepository eventRepository
    ) : IRequestHandler<EventCancelCommand, Result<string>>
{
    public async Task<Result<string>> Handle(EventCancelCommand request, CancellationToken cancellationToken)
    {
        Guid userId = claimContext.GetUserId();

        Event? eventEntity = await eventRepository.GetByIdAsync(request.EventId);

        if(eventEntity is null)
        {
            return Result<string>.Failure("Etkinlik bulunamadı.");
        }

        if(eventEntity.CreatedBy != userId)
        {
            return Result<string>.Failure("Sahibi olmadığınız etkinliği iptal edemezsiniz.");
        }

        eventEntity.Cancel();
        await eventRepository.SaveChangesAsync(cancellationToken);

        return "Etkinlik başarıyla iptal edildi.";
    }
}
