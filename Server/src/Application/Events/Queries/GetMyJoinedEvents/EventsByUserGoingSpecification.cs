using Application.Common;
using Ardalis.Specification;
using Domain.Events;
using Domain.Neighborhoods;
using Domain.Shared.ValueObjects;


namespace Application.Events.Queries.GetMyJoinedEvents;

public sealed class EventsByUserGoingSpecification : FeedBaseSpecification<Event>
{
    public EventsByUserGoingSpecification(int neighborhoodId, Guid userId)
    {
        Query
            .Where(e => e.NeighborhoodId == neighborhoodId)
            .Where(e => e.Participants.Any(p => p.UserId == userId))
            .OrderByDescending(e => e.CreatedAt);
    }
}
