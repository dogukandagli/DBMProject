using Application.Events.Queries.GetEventParticipants;
using Application.Events.Queries.GetEvents;
using Ardalis.Specification;
using Domain.Events;


namespace Application.Events.Interfaces;

public interface IEventReadService
{
    Task<List<EventDto>> GetEventsAsync(
        ISpecification<Event> specification,
        Guid currentUserId,
        CancellationToken cancellationToken = default);

    Task<List<ParticipantDto>> GetEventParticipantsAsync(
        ISpecification<EventParticipant> specification,
        Guid eventId,
        CancellationToken cancellationToken = default);
    Task<int> GetParticipantCountAsync(
        Guid eventId,
        CancellationToken cancellationToken = default);
}
