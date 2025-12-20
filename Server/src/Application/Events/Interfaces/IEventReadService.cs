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
}
