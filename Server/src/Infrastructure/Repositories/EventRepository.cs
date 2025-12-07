using Domain.Events;
using Ardalis.Specification.EntityFrameworkCore;
using Infrastructure.Context;


namespace Infrastructure.Repositories
{
    internal class EventRepository : RepositoryBase<Event>, IEventRepository
    {
        public EventRepository(ApplicationDbContext context) : base(context)
        {
        }
    
    }
}
