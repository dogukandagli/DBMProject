using Application.Common;
using Ardalis.Specification;
using Domain.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
