using Domain.Events;
using GenericRepository;
using Infrastructure.Context;


namespace Infrastructure.Repositories
{
    internal class EventRepository : Repository<Event, ApplicationDbContext>, IEventRepository
    {
        public EventRepository(ApplicationDbContext context) : base(context)
        {
        }
    
    }
}
