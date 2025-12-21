using Application.Common;
using Ardalis.Specification;
using Domain.Events;


namespace Application.Events.Queries.GetEventParticipants;

public sealed class EventParticipantSpecification : FeedBaseSpecification<EventParticipant>
{
    public EventParticipantSpecification(Guid eventId)
    {
        Query
            .Where(e => e.EventId == eventId)
            .OrderByDescending(e => e.CreatedAt);
    }
}
