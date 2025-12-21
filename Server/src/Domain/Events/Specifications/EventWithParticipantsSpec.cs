using Ardalis.Specification;
using Domain.Events;
using Domain.Posts;

public sealed class EventWithParticipantsSpec : SingleResultSpecification<Event>
{
    public EventWithParticipantsSpec(Guid eventId)
    {
        Query
            .Where(e => e.Id == eventId)
            .Include(e => e.Participants)
            .IgnoreQueryFilters();
    }
}