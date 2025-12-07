using Ardalis.Specification.EntityFrameworkCore;
using Domain.Neighborhoods;
using Infrastructure.Persistence.Context;

namespace Infrastructure.Persistence.Repositories;

internal class DistrictRepository : RepositoryBase<District>, IDistrictRepostiory
{
    public DistrictRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
    }
}
