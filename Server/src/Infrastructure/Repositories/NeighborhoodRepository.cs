using Ardalis.Specification.EntityFrameworkCore;
using Domain.Neighborhoods;
using Infrastructure.Context;

namespace Infrastructure.Repositories;

internal sealed class NeighborhoodRepository : RepositoryBase<Neighborhood>, INeighborhoodRepository
{
    public NeighborhoodRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
    }
}
