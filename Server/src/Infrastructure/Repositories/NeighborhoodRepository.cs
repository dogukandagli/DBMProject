using Domain.Neighborhoods;
using GenericRepository;
using Infrastructure.Context;

namespace Infrastructure.Repositories;

internal sealed class NeighborhoodRepository : Repository<Neighborhood, ApplicationDbContext>, INeighborhoodRepository
{
    public NeighborhoodRepository(ApplicationDbContext context) : base(context)
    {
    }
}
