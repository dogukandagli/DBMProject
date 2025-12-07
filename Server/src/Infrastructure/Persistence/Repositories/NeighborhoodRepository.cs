using Ardalis.Specification.EntityFrameworkCore;
using Domain.Neighborhoods;
using Infrastructure.Persistence.Context;

namespace Infrastructure.Persistence.Repositories;

internal sealed class NeighborhoodRepository : RepositoryBase<Neighborhood>, INeighborhoodRepository
{
    public NeighborhoodRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
    }
}
