using Application.Common;
using Ardalis.Specification;
using Domain.Events;

namespace Application.Events.Queries.GetMyEvents;

public sealed class EventsByUserSpecification : FeedBaseSpecification<Event>
{
    public EventsByUserSpecification(Guid userId)
    {
        Query.Where(e => e.CreatedBy == userId)
            .OrderByDescending(e => e.CreatedAt);
    }
}
