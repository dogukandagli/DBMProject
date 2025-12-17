using Application.Services;
using Domain.Events;
using Domain.Events.Repositories;
using MediatR;
using TS.Result;

namespace Application.Events.Commands;

public sealed record EventDeleteCommand(Guid EventId) : IRequest<Result<string>>;

internal sealed class EventDeleteCommandHandler(
    IEventRepository eventRepository,
    IClaimContext claimContext) : IRequestHandler<EventDeleteCommand, Result<string>>
{
    public async Task<Result<string>> Handle(EventDeleteCommand request, CancellationToken cancellationToken)
    {
        Guid userId = claimContext.GetUserId();

        Event? eventEntity = await eventRepository.GetByIdAsync(request.EventId);

        if(eventEntity is null)
        {
            return Result<string>.Failure("Etkinlik bulunamadı.");
        }

        if(userId != eventEntity.CreatedBy)
        {
            return Result<string>.Failure("Sizin olmayan etkinlikleri silemezsiniz.");
        }

        eventEntity.Delete();
        await eventRepository.SaveChangesAsync(cancellationToken);

        return "Etkinlik başarıyla silindi.";
    }
}
