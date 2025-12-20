using Application.Common;
using Ardalis.Specification;
using Domain.Events;


namespace Application.Events.Queries.GetEvents;

public sealed class EventByNeighborhoodSpecification : FeedBaseSpecification<Event>
{
    public EventByNeighborhoodSpecification(int neighborhoodId)
    {
        Query
            .Where(e => e.NeighborhoodId == neighborhoodId)
            .OrderByDescending(e => e.CreatedAt);
    }
}
