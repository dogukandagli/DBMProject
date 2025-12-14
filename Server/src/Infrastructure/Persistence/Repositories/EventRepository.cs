using Domain.Events;
using Ardalis.Specification.EntityFrameworkCore;
using Infrastructure.Persistence.Context;
using Domain.Events.Repositories;


namespace Infrastructure.Repositories
{
    internal class EventRepository : RepositoryBase<Event>, IEventRepository
    {
        public EventRepository(ApplicationDbContext context) : base(context)
        {
        }
    
    }
}
